from django.test import TestCase
from .models import Account


class AccountManagerTests(TestCase):
    def test_create_user_sets_password(self):
        """Account.objects.create_user should hash the provided password."""
        user = Account.objects.create_user(
            email="user@example.com",
            username="testuser",
            password="testpass",
        )

        self.assertTrue(user.check_password("testpass"))
