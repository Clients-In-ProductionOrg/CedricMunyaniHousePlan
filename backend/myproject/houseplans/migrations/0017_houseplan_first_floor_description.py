from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0016_merge_20260208_1949'),
    ]

    operations = [
        migrations.AddField(
            model_name='houseplan',
            name='first_floor_description',
            field=models.TextField(blank=True, default=''),
        ),
    ]
