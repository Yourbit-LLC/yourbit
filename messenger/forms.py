from django import forms
from .models import Conversation, Message

class NewMessage(forms.ModelForm):
    body = forms.CharField(
        required=True, widget = forms.widgets.TextInput(
            attrs={
                "placeholder" : "Write Message",
                "class" : "message-field",
                "id":"message-field",
                "name":"message",
            }
        )
    )
    class Meta:
        model = Message
        fields=['body']

class CreateConversation(forms.ModelForm):
    receiver_user = forms.CharField(required=True, widget = forms.widgets.TextInput(
            attrs={
                "placeholder" : "Write Message",
                "class" : "message-field",
                "id":"message-field",
                "name":"message",
            }))
    sender_user = forms.CharField(required=True, widget = forms.widgets.TextInput(
            attrs={
                "placeholder" : "Write Message",
                "class" : "message-field",
                "id":"message-field",
                "name":"message",
            }))
    
    class Meta:
        model = Conversation
        fields=['receiver_user', 'sender_user']
        exclude=['user']
