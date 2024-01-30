from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "yb_developer/developer_index.html")