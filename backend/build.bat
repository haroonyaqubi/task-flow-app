@echo off
echo Installing Python dependencies...
pip install -r requirements.txt

echo Applying database migrations...
python manage.py migrate

echo Collecting static files...
python manage.py collectstatic --no-input

echo Build completed successfully!