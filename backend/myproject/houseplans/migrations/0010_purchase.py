# Generated migration for Purchase model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0009_room_quantity'),
    ]

    operations = [
        migrations.CreateModel(
            name='Purchase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plan_price', models.DecimalField(decimal_places=2, help_text='Price at time of purchase', max_digits=12)),
                ('full_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=20)),
                ('province', models.CharField(choices=[('eastern_cape', 'Eastern Cape'), ('free_state', 'Free State'), ('gauteng', 'Gauteng'), ('kwazulu_natal', 'KwaZulu-Natal'), ('limpopo', 'Limpopo'), ('mpumalanga', 'Mpumalanga'), ('northern_cape', 'Northern Cape'), ('north_west', 'North West'), ('western_cape', 'Western Cape')], max_length=50)),
                ('city', models.CharField(max_length=150)),
                ('pick_up_point', models.CharField(blank=True, help_text='Optional: Specific location for pickup', max_length=255)),
                ('area_mall', models.CharField(blank=True, help_text='e.g., Johannesburg CBD, Sandton City', max_length=255)),
                ('payment_status', models.CharField(choices=[('pending', 'Pending Payment'), ('completed', 'Payment Completed'), ('cancelled', 'Cancelled'), ('failed', 'Payment Failed')], default='pending', help_text='Current payment status', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('payment_date', models.DateTimeField(blank=True, help_text='Date when payment was completed', null=True)),
                ('house_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchases', to='houseplans.houseplan')),
            ],
            options={
                'verbose_name': 'Purchase',
                'verbose_name_plural': 'Purchases',
                'ordering': ['-created_at'],
            },
        ),
    ]
