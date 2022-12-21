from django.urls import path
from .views import *

urlpatterns = [
    path('create-conversation/', NewConversationView.as_view(), name = 'new-conversation'),
    path('inbox/', Messages.as_view(), name='inbox'),
    path('conversation/<int:id>', ConversationView.as_view(), name='conversation'),
    path('send/', SendMessage.as_view(), name='send-message'),
    
]