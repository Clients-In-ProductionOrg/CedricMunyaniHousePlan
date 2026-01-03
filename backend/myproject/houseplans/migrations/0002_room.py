# Migration to add Room model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='e.g., Master Bedroom, Kitchen, Living Room, etc.', max_length=200)),
                ('description', models.TextField(blank=True)),
                ('order', models.IntegerField(default=0, help_text='Order to display rooms')),
                ('floor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rooms', to='houseplans.floor')),
            ],
            options={
                'verbose_name': 'Room',
                'verbose_name_plural': 'Rooms',
                'ordering': ['order'],
            },
        ),
    ]
