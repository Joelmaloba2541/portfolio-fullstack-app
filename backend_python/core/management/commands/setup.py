from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Setup database with migrations and create default admin user'

    def handle(self, *args, **options):
        self.stdout.write('Running migrations...')
        from django.core.management import call_command
        call_command('migrate')
        
        self.stdout.write('Creating superuser...')
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@gmail.com',
                password='admin',
                is_admin=True
            )
            self.stdout.write(self.style.SUCCESS('Superuser "admin" created successfully!'))
            self.stdout.write('Username: admin')
            self.stdout.write('Email: admin@gmail.com')
            self.stdout.write('Password: admin')
        else:
            self.stdout.write(self.style.WARNING('Superuser "admin" already exists'))
        
        self.stdout.write(self.style.SUCCESS('Setup completed successfully!'))
