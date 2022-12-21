from django import forms
from .models import SearchHistory

class SearchBar(forms.ModelForm):
    query = forms.CharField(
        required = True, widget = forms.widgets.TextInput(
            attrs={
            "placeholder": "Search Yourbit",
            "class": "search-bar",
            "id":"search-bar",
            "name":"searched",
            "autocomplete":"off",

            }
        )
    )

    class Meta:
        model = SearchHistory
        fields=['query']
