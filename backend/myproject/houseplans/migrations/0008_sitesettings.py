from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0007_contactmessage'),
    ]

    operations = [
        migrations.CreateModel(
            name='SiteSettings',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('phone', models.CharField(help_text='e.g., 0695885837', max_length=20)),
                ('email', models.EmailField(help_text='e.g., Cedrichouseplan@gmail.com', max_length=254)),
                ('address', models.TextField(help_text='e.g., South Africa, Venda')),
                ('monday_friday_hours', models.CharField(default='9:00 AM - 6:00 PM', help_text='Monday - Friday hours', max_length=100)),
                ('saturday_hours', models.CharField(default='10:00 AM - 4:00 PM', help_text='Saturday hours', max_length=100)),
                ('sunday_hours', models.CharField(default='Closed', help_text='Sunday hours', max_length=100)),
                ('company_name', models.CharField(blank=True, help_text='Your company name', max_length=200)),
                ('website_url', models.URLField(blank=True, help_text='Your website URL')),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Site Settings',
                'verbose_name_plural': 'Site Settings',
            },
        ),
    ]
