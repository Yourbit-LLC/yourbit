from django.apps import AppConfig


class YbNotifyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'yb_notify'
    
    def ready(self):
        import yb_notify.signals
