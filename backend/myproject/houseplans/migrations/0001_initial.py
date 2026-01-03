# Generated migration for enhanced HousePlan model with related models

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='HousePlan',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('display_location', models.CharField(choices=[('house_plans_page', 'House Plans Page')], default='house_plans_page', max_length=50)),
                ('bedrooms', models.IntegerField(default=1)),
                ('bathrooms', models.IntegerField(default=1)),
                ('garage', models.IntegerField(default=0)),
                ('square_feet', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('width_meters', models.DecimalField(blank=True, decimal_places=2, help_text='Width in meters', max_digits=8, null=True)),
                ('depth_meters', models.DecimalField(blank=True, decimal_places=2, help_text='Depth in meters', max_digits=8, null=True)),
                ('primary_image', models.ImageField(blank=True, help_text='Primary/thumbnail image', null=True, upload_to='house_plans/')),
                ('video_url', models.URLField(blank=True, help_text='YouTube video URL', null=True)),
                ('is_popular', models.BooleanField(default=False, help_text="Show in 'Popular House Plans' section")),
                ('is_best_selling', models.BooleanField(default=False, help_text="Show in 'Best-Selling Designs' section")),
                ('is_new', models.BooleanField(default=False)),
                ('is_pet_friendly', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'House Plan',
                'verbose_name_plural': 'House Plans',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='HousePlanImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='house_plan_images/')),
                ('title', models.CharField(blank=True, help_text='Image title or description', max_length=200)),
                ('order', models.IntegerField(default=0, help_text='Order to display images')),
                ('house_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='houseplans.houseplan')),
            ],
            options={
                'verbose_name': 'House Plan Image',
                'verbose_name_plural': 'House Plan Images',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Floor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('level', models.CharField(choices=[('ground', 'Ground Floor'), ('first', 'First Floor'), ('second', 'Second Floor'), ('third', 'Third Floor'), ('basement', 'Basement')], max_length=20)),
                ('floor_area', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('bedrooms', models.IntegerField(default=0)),
                ('bathrooms', models.IntegerField(default=0)),
                ('lounges', models.IntegerField(default=0)),
                ('dining_areas', models.IntegerField(default=0)),
                ('notes', models.TextField(blank=True, help_text='Floor-specific notes or description')),
                ('order', models.IntegerField(default=0, help_text='Order to display floors')),
                ('house_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='floors', to='houseplans.houseplan')),
            ],
            options={
                'verbose_name': 'Floor',
                'verbose_name_plural': 'Floors',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Feature',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('order', models.IntegerField(default=0)),
                ('house_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='features', to='houseplans.houseplan')),
            ],
            options={
                'verbose_name': 'Feature',
                'verbose_name_plural': 'Features',
                'ordering': ['order'],
            },
        ),
        migrations.CreateModel(
            name='Amenity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('order', models.IntegerField(default=0)),
                ('house_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='amenities_list', to='houseplans.houseplan')),
            ],
            options={
                'verbose_name': 'Amenity',
                'verbose_name_plural': 'Amenities',
                'ordering': ['order'],
            },
        ),
    ]
