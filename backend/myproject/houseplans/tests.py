from io import BytesIO

from django.contrib.admin.sites import site
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory, TestCase
from PIL import Image
from rest_framework.test import APIRequestFactory

from houseplans.admin import HousePlanAdmin, HousePlanAdminForm, HousePlanImageInlineForm
from houseplans.models import HousePlan, HousePlanImage
from houseplans.views import house_plans_list


class HousePlanAdminUploadTests(TestCase):
    def _make_uploaded_image(self, filename, color):
        image_buffer = BytesIO()
        Image.new('RGB', (10, 10), color).save(image_buffer, format='PNG')
        image_buffer.seek(0)
        return SimpleUploadedFile(
            filename,
            image_buffer.getvalue(),
            content_type='image/png'
        )

    def test_bulk_images_accepts_multiple_uploads(self):
        upload_a = self._make_uploaded_image('first.png', 'red')
        upload_b = self._make_uploaded_image('second.png', 'blue')

        form = HousePlanAdminForm(
            data={
                'title': 'Test House Plan',
                'description': 'A test house plan',
                'price': '1000',
                'display_location': 'house_plans_page',
                'property_type': 'house',
                'status': 'normal',
                'bedrooms': 2,
                'bathrooms': 2,
                'garage': 1,
                'land_size': '1000',
                'style': 'Modern',
            },
            files={'bulk_images': [upload_a, upload_b]}
        )

        self.assertTrue(form.is_valid(), form.errors)

    def test_bulk_images_are_saved_to_related_images(self):
        upload_a = self._make_uploaded_image('first.png', 'red')
        upload_b = self._make_uploaded_image('second.png', 'blue')

        form = HousePlanAdminForm(
            data={
                'title': 'Test House Plan',
                'description': 'A test house plan',
                'price': '1000',
                'display_location': 'house_plans_page',
                'property_type': 'house',
                'status': 'normal',
                'bedrooms': 2,
                'bathrooms': 2,
                'garage': 1,
                'land_size': '1000',
                'style': 'Modern',
            },
            files={'bulk_images': [upload_a, upload_b]}
        )

        self.assertTrue(form.is_valid(), form.errors)

        house_plan = form.save(commit=False)
        house_plan.save()

        admin = HousePlanAdmin(HousePlan, site)
        request = RequestFactory().get('/')
        admin.save_model(request, house_plan, form, change=False)

        self.assertEqual(HousePlanImage.objects.filter(house_plan=house_plan).count(), 2)

    def test_bulk_images_append_when_editing_existing_plan(self):
        existing_plan = HousePlan.objects.create(
            title='Existing Plan',
            description='Already has images',
            price=1200,
            display_location='house_plans_page',
            property_type='house',
            status='normal',
            bedrooms=3,
            bathrooms=2,
            garage=1,
            land_size='1000',
            style='Modern',
        )

        existing_image = self._make_uploaded_image('existing.png', 'green')
        HousePlanImage.objects.create(
            house_plan=existing_plan,
            image=existing_image,
            title='existing.png',
            order=1,
        )

        upload_a = self._make_uploaded_image('new-a.png', 'red')
        upload_b = self._make_uploaded_image('new-b.png', 'blue')

        form = HousePlanAdminForm(
            data={
                'title': existing_plan.title,
                'description': existing_plan.description,
                'price': str(existing_plan.price),
                'display_location': existing_plan.display_location,
                'property_type': existing_plan.property_type,
                'status': existing_plan.status,
                'bedrooms': existing_plan.bedrooms,
                'bathrooms': existing_plan.bathrooms,
                'garage': existing_plan.garage,
                'land_size': existing_plan.land_size,
                'style': existing_plan.style,
            },
            files={'bulk_images': [upload_a, upload_b]},
            instance=existing_plan,
        )

        self.assertTrue(form.is_valid(), form.errors)

        plan = form.save(commit=False)
        plan.save()

        admin = HousePlanAdmin(HousePlan, site)
        request = RequestFactory().get('/')
        admin.save_model(request, plan, form, change=True)

        all_images = HousePlanImage.objects.filter(house_plan=existing_plan).order_by('order')
        self.assertEqual(all_images.count(), 3)
        self.assertEqual([img.order for img in all_images], [1, 2, 3])

    def test_inline_edit_without_new_file_keeps_existing_image(self):
        plan = HousePlan.objects.create(
            title='Plan With Existing Image',
            description='Plan',
            price=1300,
            display_location='house_plans_page',
            property_type='house',
            status='normal',
            bedrooms=2,
            bathrooms=1,
            garage=1,
            land_size='800',
            style='Modern',
        )

        existing_upload = self._make_uploaded_image('existing-inline.png', 'yellow')
        image = HousePlanImage.objects.create(
            house_plan=plan,
            image=existing_upload,
            title='existing-inline.png',
            order=1,
        )

        form = HousePlanImageInlineForm(
            data={'title': image.title, 'order': image.order},
            files={},
            instance=image,
        )

        self.assertTrue(form.is_valid(), form.errors)
        cleaned = form.cleaned_data.get('image')
        self.assertFalse(isinstance(cleaned, list))
        self.assertEqual(getattr(cleaned, 'name', ''), image.image.name)

    def test_house_plans_endpoint_defaults_to_house_plans_page(self):
        house_plan = HousePlan.objects.create(
            title='House Catalog Plan',
            price=1000,
            bedrooms=2,
            bathrooms=2,
            garage=1,
            display_location='house_plans_page',
            style='Modern',
            status='normal'
        )
        built_plan = HousePlan.objects.create(
            title='Built Catalog Plan',
            price=2000,
            bedrooms=3,
            bathrooms=2,
            garage=2,
            display_location='built_plans_page',
            style='Modern',
            status='normal'
        )

        factory = APIRequestFactory()
        request = factory.get('/api/house-plans/')
        response = house_plans_list(request)

        self.assertEqual(response.status_code, 200)
        titles = [item['title'] for item in response.data]
        self.assertIn(house_plan.title, titles)
        self.assertNotIn(built_plan.title, titles)

    def test_house_plans_endpoint_can_filter_to_built_plans_page(self):
        house_plan = HousePlan.objects.create(
            title='House Catalog Plan Two',
            price=1000,
            bedrooms=2,
            bathrooms=2,
            garage=1,
            display_location='house_plans_page',
            style='Modern',
            status='normal'
        )
        built_plan = HousePlan.objects.create(
            title='Built Catalog Plan Two',
            price=2000,
            bedrooms=3,
            bathrooms=2,
            garage=2,
            display_location='built_plans_page',
            style='Modern',
            status='normal'
        )

        factory = APIRequestFactory()
        request = factory.get('/api/house-plans/', {'display_on': 'built_plans_page'})
        response = house_plans_list(request)

        self.assertEqual(response.status_code, 200)
        titles = [item['title'] for item in response.data]
        self.assertNotIn(house_plan.title, titles)
        self.assertIn(built_plan.title, titles)
