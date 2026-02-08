from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0012_purchase_yoco_reference_purchase_yoco_token'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchase',
            name='secret_password_hash',
            field=models.CharField(blank=True, default='', help_text='Hashed secret password', max_length=128),
        ),
    ]
