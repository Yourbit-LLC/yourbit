from django.urls import path
from .views import *
from django.views.generic import TemplateView


#URL '/messages'
urlpatterns = [
    path('inbox/public', NewConversationView.as_view(), name = 'new-conversation'),
    path('inbox/private', NewConversationView.as_view(), name = 'new-conversation'),
    path('inbox/', Messages.as_view(), name='inbox'),
    path('conversation/<int:id>', ConversationView.as_view(), name='conversation'),
    path('api/check_existing/<str:username>/', check_existing_conversation, name='check-existing'),
    path('templates/messages-html/', TemplateView.as_view(template_name='messenger/messages.html')),
    path('templates/conversation-html/', TemplateView.as_view(template_name='conversation.html')),
    
    
    
]