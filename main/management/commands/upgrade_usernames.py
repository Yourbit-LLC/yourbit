from django.core.management.base import BaseCommand
from yb_accounts.models import Account as User

class Command(BaseCommand):
    help = "Puts all current usernames into a display_username field and sets all current usernames to lowercase"

    def handle(self, *args, **kwargs):
        users = User.objects.all()

        for user in users:
            user.display_username = user.username
            user.username = user.username.lower()
            user.save()

        self.stdout.write(self.style.SUCCESS(f"Successfully upgraded usernames for {users.count()} users!"))
        
