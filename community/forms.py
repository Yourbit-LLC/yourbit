from django import forms
from .models import Community

class CommunityForm(forms.ModelForm):
    name = forms.CharField(
        required=True, widget = forms.widgets.TextInput(
            attrs={
                "id":"yb-community-name",
                "class":"single-line-input",
                "placeholder":"ie 'Sally's Seashells'"
            }
        )
    )

    about = forms.CharField(
        required=False, widget = forms.widgets.TextInput(
            attrs={
                "id":"yb-community-info",
                "class":"single-line-input",
                "placeholder":"ie 'A seashell shop'"
            }
        )
    )

    company = forms.CharField(
        required=False, widget = forms.widgets.TextInput(
            attrs={
                "id":"yb-community-company",
                "class":"single-line-input",
            }
        )
    )

    page_type = forms.CharField(
        required=True, widget = forms.widgets.TextInput(
            attrs={
                "id":"yb-community-type", 
                "class":"single-line-input",
            }
        )
    )

    default_space = forms.CharField(
        required=True, widget = forms.widgets.TextInput(
            attrs={
                "id":"yb-community-space",
                "class":"single-line-input"
            }
        )
    )

    class Meta:
        model = Community
        fields = ('name', 'about', 'type', 'default_space')