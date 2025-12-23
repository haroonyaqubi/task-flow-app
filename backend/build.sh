#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Create superuser (optional - uncomment if needed)
# echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell