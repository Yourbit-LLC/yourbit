from django.shortcuts import render
from django.contrib import admin
from django.urls import path, include
from yb_messages.views import message_inbox, new_conversation_template, MessagePage, ConversationView

urlpatterns = [
    path("inbox/", message_inbox, name="message_inbox"),
    path("templates/new-message/", new_conversation_template, name="message_new"),
    path("templates/conversation/<int:id>/", ConversationView.as_view(), name="conversation"),
    path('api/', include('yb_messages.routers')),
    path('', MessagePage.as_view(), name="message_inbox")
    
]