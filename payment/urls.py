from django.urls import path
from .views import *

urlpatterns = [
    path('create-payment-intent/<int:amount>', StripeIntent.as_view(), name='create-payment-intent'),
    path('donate/', Donate.as_view(), name='donate'),
    path('checkout/<int:amount>', Checkout.as_view(), name = 'checkout'),
]