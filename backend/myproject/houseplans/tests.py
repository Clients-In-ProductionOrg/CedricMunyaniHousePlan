from io import BytesIO

from django.contrib.admin.sites import site
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import RequestFactory, TestCase
from PIL import Image

from houseplans.admin import HousePlanAdmin, HousePlanAdminForm
from houseplans.models import HousePlan, HousePlanImage


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
