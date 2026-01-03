from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0008_sitesettings'),
    ]

    operations = [
        migrations.AddField(
            model_name='room',
            name='quantity',
            field=models.IntegerField(default=1, help_text='Number of this room type (e.g., 2 for Bedroom 2)'),
        ),
    ]
