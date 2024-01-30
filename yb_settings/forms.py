from django import forms
from yb_settings.models import *

class PrivacySettingsForm(forms.ModelForm):
    class Meta:
        model = PrivacySettings
        fields = ('__all__')

class NotificationSettingsForm(forms.ModelForm):
    class Meta:
        model = NotificationSettings
        fields = ('__all__')

class FeedSettingsForm(forms.ModelForm):
    class Meta:
        model = FeedSettings
        fields = ('__all__')


class ShortPrivacyForm(forms.ModelForm):
    display_name = forms.CharField(max_length=50, required=False)
    class Meta:
        model = PrivacySettings
        fields = (
            'enable_followers', 
            'searchable', 
            'display_name',
            'real_name_visibility', 
            'message_availability', 
            'default_public'
        )