from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_messages.views import message_inbox, new_conversation_template, MessagePage, ConversationView, check_new_messages, filter_contacts_list, conversation_settings_template

urlpatterns = [
    path("inbox/", message_inbox, name="message_inbox"),
    path('check/<int:id>/<int:last_message>/', check_new_messages, name='check-new-messages'),
    path('list/contacts/<str:query>/', filter_contacts_list, name='list-contacts'),
    path("templates/new-message/", new_conversation_template, name="message_new"),
    path("templates/conversation-settings/<int:id>/", conversation_settings_template, name="conversation-settings"),
    path("templates/conversation/<int:id>/", ConversationView.as_view(), name="conversation"),
    path('api/', include('yb_messages.routers')),
    path('', MessagePage.as_view(), name="message_inbox")
    
]