from locale import currency
from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from user_profile.models import Profile
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY
# Create your views here.
class StripeIntent(View):
    def post(self, request, *args, **kwargs):
        user = request.user
        user_profile = Profile.objects.get(user=user)
        amount = self.kwargs["amount"]
        print(amount)
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency='usd'
            )

            return JsonResponse({
                'clientSecret': intent['client_secret']
            })

        except Exception as e:
            return JsonResponse({'error': str(e)})


class Checkout(View):
    def get(self, request, *args, **kwargs):
        amount = self.kwargs["amount"]
        print(amount)
        context = {'amount':amount}
        return render(request, 'social/checkout.html', context)

class Donate(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'social/donate.html')