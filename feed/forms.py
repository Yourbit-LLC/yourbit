from django import forms
from .models import *


class CommentForm(forms.ModelForm):
    comment = forms.CharField(
        required=False, widget = forms.widgets.Textarea(
        attrs={
            "placeholder": "Write Comment",
            "class": "write-comment-field-text",
            "rows": "1",
            "cols": "100"
            }
        ), label="",
    )

    class Meta:
        model = Comment
        fields=['comment']
        exclude =("user",)


