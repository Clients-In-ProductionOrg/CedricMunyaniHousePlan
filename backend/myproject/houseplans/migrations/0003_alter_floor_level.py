from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0002_room'),
    ]

    operations = [
        migrations.AlterField(
            model_name='floor',
            name='level',
            field=models.CharField(choices=[('ground', 'Ground Floor'), ('first', 'First Floor'), ('second', 'Second Floor'), ('third', 'Third Floor'), ('fourth', 'Fourth Floor'), ('fifth', 'Fifth Floor'), ('sixth', 'Sixth Floor'), ('seventh', 'Seventh Floor'), ('eighth', 'Eighth Floor'), ('ninth', 'Ninth Floor'), ('tenth', 'Tenth Floor'), ('basement', 'Basement')], max_length=20),
        ),
    ]
