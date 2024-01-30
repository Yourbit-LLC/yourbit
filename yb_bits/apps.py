from django.apps import AppConfig


class YbBitsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'yb_bits'

    def ready(self):
            import yb_bits.signals