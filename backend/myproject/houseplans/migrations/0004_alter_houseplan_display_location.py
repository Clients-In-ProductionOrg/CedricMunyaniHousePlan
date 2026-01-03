from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0003_alter_floor_level'),
    ]

    operations = [
        migrations.AlterField(
            model_name='houseplan',
            name='display_location',
            field=models.CharField(choices=[('house_plans_page', 'House Plans Page'), ('built_plans_page', 'Built Plans Page')], default='house_plans_page', max_length=50),
        ),
    ]
