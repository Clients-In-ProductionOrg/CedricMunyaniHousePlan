release: cd backend/myproject && python manage.py collectstatic --noinput
web: gunicorn --chdir backend/myproject myproject.wsgi:application --workers 1 --threads 2 --timeout 300 --graceful-timeout 60 --keep-alive 5 --max-requests 500 --max-requests-jitter 50
