from django.apps import AppConfig


class YbProfileConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'yb_profile'

    
    def ready(self):
        import yb_profile.signals
