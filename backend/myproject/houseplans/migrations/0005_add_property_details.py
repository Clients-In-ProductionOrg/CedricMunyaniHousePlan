from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0004_alter_houseplan_display_location'),
    ]

    operations = [
        migrations.AddField(
            model_name='houseplan',
            name='property_type',
            field=models.CharField(choices=[('house', 'House'), ('apartment', 'Apartment'), ('condo', 'Condo'), ('townhouse', 'Townhouse'), ('villa', 'Villa'), ('cottage', 'Cottage')], default='house', max_length=50),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='land_size',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Land size in m²', max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='style',
            field=models.CharField(blank=True, help_text='e.g., Contemporary, Modern', max_length=100),
        ),
        migrations.AddField(
            model_name='houseplan',
            name='status',
            field=models.CharField(choices=[('featured', 'Featured'), ('normal', 'Normal'), ('limited', 'Limited Edition')], default='normal', max_length=20),
        ),
    ]
