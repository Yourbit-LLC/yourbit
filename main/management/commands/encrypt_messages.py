from django.core.management.base import BaseCommand
from yb_messages.models import Message
from main.models import get_cipher  # Ensure you have the `get_cipher` function

class Command(BaseCommand):
    help = "Encrypts all existing plaintext messages in the database"

    def handle(self, *args, **kwargs):
        cipher = get_cipher()
        messages_to_encrypt = Message.objects.filter(encrypted_body__isnull=True, body__isnull=False)

        if not messages_to_encrypt.exists():
            self.stdout.write(self.style.SUCCESS("No messages need encryption."))
            return

        total = messages_to_encrypt.count()
        self.stdout.write(f"Encrypting {total} messages...")

        for message in messages_to_encrypt:
            message.encrypted_body = cipher.encrypt(message.body.encode()).decode()
            message.save()

        self.stdout.write(self.style.SUCCESS(f"Successfully encrypted {total} messages!"))
