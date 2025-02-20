from django.core.management.base import BaseCommand
from yb_bits.models import Bit
from yb_bits.models import get_cipher  # Ensure you have the `get_cipher()` function


class Command(BaseCommand):
    help = "Encrypts all existing plaintext private bits and moves them to protected fields"

    def handle(self, *args, **kwargs):
        cipher = get_cipher()
        
        # Get all private bits where protected fields are still empty
        bits_to_encrypt = Bit.objects.filter(
            is_public=False,
        )  # Exclude empty public bodies

        if not bits_to_encrypt.exists():
            self.stdout.write(self.style.SUCCESS("No private bits need encryption."))
            return

        total = bits_to_encrypt.count()
        self.stdout.write(f"Encrypting {total} private bits...")

        for bit in bits_to_encrypt:
            try:
                # Encrypt body and title
                
                bit.protected_body = cipher.encrypt(bit.public_body.encode()).decode() if bit.public_body else ""
                
                bit.protected_title = cipher.encrypt(bit.public_title.encode()).decode() if bit.public_title else ""

                # Clear public fields
                bit.public_body = ""
                bit.public_title = ""

                # Save changes
                bit.save()
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Failed to encrypt Bit ID {bit.id}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully encrypted {total} private bits!"))
