from django.shortcuts import render
from django.views import View
from .forms import BitForm

# Create your views here.
def bit_builder_view(request):
    bit_form = BitForm()
    return render(request, "yb_bits/yb_bitBuilder.html", {"bit_form":bit_form})

def bitstream_view(request):
    return render(request, "yb_bits/yb_bitStream.html")