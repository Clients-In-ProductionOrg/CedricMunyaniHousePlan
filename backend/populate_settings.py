#!/usr/bin/env python
import os
import sys
import django

# Add the myproject directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'myproject'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from houseplans.models import SiteSettings

# Get or create settings and populate
settings = SiteSettings.get_settings()
settings.phone = '0695885837'
settings.email = 'Cedrichouseplan@gmail.com'
settings.address = 'South Africa, Venda'
settings.company_name = 'Cedric House Plans'
settings.website_url = 'https://cedrichouseplans.com'
settings.monday_friday_hours = '9:00 AM - 6:00 PM'
settings.saturday_hours = '10:00 AM - 4:00 PM'
settings.sunday_hours = 'Closed'
settings.save()

print('✅ SiteSettings updated successfully!')
print(f'Phone: {settings.phone}')
print(f'Email: {settings.email}')
print(f'Address: {settings.address}')
print(f'Company: {settings.company_name}')
