release: cd backend/myproject && python manage.py collectstatic --noinput
web: gunicorn --chdir backend/myproject myproject.wsgi:application
