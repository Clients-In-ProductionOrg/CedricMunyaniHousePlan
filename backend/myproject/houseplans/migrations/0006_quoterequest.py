from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0005_add_property_details'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuoteRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=200)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=20)),
                ('city', models.CharField(max_length=100)),
                ('preferred_style', models.CharField(choices=[('contemporary', 'Contemporary'), ('modern', 'Modern'), ('traditional', 'Traditional'), ('colonial', 'Colonial'), ('craftsman', 'Craftsman'), ('farmhouse', 'Farmhouse'), ('mediterranean', 'Mediterranean'), ('minimalist', 'Minimalist'), ('not_sure', 'Not Sure')], max_length=50)),
                ('bedrooms', models.IntegerField()),
                ('bathrooms', models.IntegerField()),
                ('other_required_rooms', models.TextField(blank=True, help_text='e.g., Home office, gym, guest suite, entertainment area...')),
                ('stand_length_meters', models.DecimalField(decimal_places=2, help_text='Length in meters', max_digits=8)),
                ('stand_breadth_meters', models.DecimalField(decimal_places=2, help_text='Breadth in meters', max_digits=8)),
                ('budget', models.CharField(choices=[('under_500k', 'Under R500,000'), ('500k_1m', 'R500,000 - R1,000,000'), ('1m_2m', 'R1,000,000 - R2,000,000'), ('2m_3m', 'R2,000,000 - R3,000,000'), ('3m_5m', 'R3,000,000 - R5,000,000'), ('above_5m', 'Above R5,000,000')], max_length=20)),
                ('project_description', models.TextField(help_text='Describe your vision for the home, any specific features, lifestyle needs, or inspiration...')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_reviewed', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'Quote Request',
                'verbose_name_plural': 'Quote Requests',
                'ordering': ['-created_at'],
            },
        ),
    ]
