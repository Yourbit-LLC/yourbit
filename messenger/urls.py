from django.urls import path
from .views import *

urlpatterns = [
    path('inbox/public', NewConversationView.as_view(), name = 'new-conversation'),
    path('inbox/private', NewConversationView.as_view(), name = 'new-conversation'),
    path('inbox/', Messages.as_view(), name='inbox'),
    path('conversation/<int:id>', ConversationView.as_view(), name='conversation'),
    path('api/check_existing/<str:username>/', check_existing_conversation, name='check-existing'),
    
    
]