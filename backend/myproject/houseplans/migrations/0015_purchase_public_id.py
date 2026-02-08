from django.db import migrations, models
import secrets

ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'


def generate_public_id(length: int = 7) -> str:
    return ''.join(secrets.choice(ALPHABET) for _ in range(length))


def populate_public_id(apps, schema_editor):
    Purchase = apps.get_model('houseplans', 'Purchase')
    for purchase in Purchase.objects.filter(public_id__isnull=True):
        while True:
            candidate = generate_public_id()
            if not Purchase.objects.filter(public_id=candidate).exists():
                purchase.public_id = candidate
                purchase.save(update_fields=['public_id'])
                break


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('houseplans', '0014_purchase_yoco_checkout_id_purchase_yoco_payment_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchase',
            name='public_id',
            field=models.CharField(
                max_length=7,
                unique=True,
                db_index=True,
                blank=True,
                null=True,
                help_text='Public purchase ID used in URLs'
            ),
        ),
        migrations.RunPython(populate_public_id, noop),
        migrations.AlterField(
            model_name='purchase',
            name='public_id',
            field=models.CharField(
                max_length=7,
                unique=True,
                db_index=True,
                blank=True,
                help_text='Public purchase ID used in URLs'
            ),
        ),
    ]
