from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0017_houseplan_first_floor_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='houseplan',
            name='second_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='third_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='fourth_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='fifth_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='sixth_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='seventh_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='eighth_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='ninth_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='tenth_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
    ]
