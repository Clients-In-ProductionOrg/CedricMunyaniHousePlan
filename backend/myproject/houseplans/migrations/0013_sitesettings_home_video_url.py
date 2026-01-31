from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0012_purchase_yoco_reference_purchase_yoco_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='home_video_url',
            field=models.URLField(blank=True, help_text='Homepage YouTube video URL'),
        ),
    ]
