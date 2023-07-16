
from django import forms
from .models import Profile, Bit

class ProfilePictureUpload(forms.ModelForm):
    image = forms.FileField(required=True)

    def __init__(self, *args, **kwargs):
        super(ProfilePictureUpload, self).__init__(*args, **kwargs)
        self.fields['image'].widget.attrs.update({'name': 'profile_image_field', 'class':'profile-image-field', 'id':'profile-image-field'})


    class Meta:
        model = Profile
        fields = ('image',)
        exclude = ("user", )

class BackgroundPictureUpload(forms.ModelForm):
    background_image = forms.FileField(required=True)
    def __init__(self, *args, **kwargs):
        super(BackgroundPictureUpload, self).__init__(*args, **kwargs)
        self.fields['background_image'].widget.attrs.update({'name': 'background_image_field', 'class':'profile-image-field', 'id':'bkd-image-field'})
    class Meta:
        model = Profile
        fields = ('background_image',)
        exclude = ("user",)


class BitForm(forms.ModelForm):
    title = forms.CharField(
        required=False, widget = forms.widgets.Textarea(
        attrs={
            "placeholder": "Title",
            "class": "create-post-title-field"
            }
        ), label="",
    )
    body = forms.CharField(
        required=False, widget = forms.widgets.Textarea(
        attrs={
            "placeholder": "Description",
            "class": "create-post-description-field"
            }
        ), label="",
    )

    video = forms.FileField(
        required=False, widget = forms.widgets.FileInput(
            attrs={
                "class":"file-upload-field",
            }
        ), label="",
    )

    image = forms.FileField(
        required=False, widget = forms.widgets.FileInput(
            attrs={
                "class":"file-upload-field",
            }
        ), label="",
    )

    tags = forms.CharField(
        required=False, widget = forms.widgets.Textarea(
            attrs={
                "class":"create-post-tags-field",
            }
        ), label = "",
    )

    is_public = forms.BooleanField(
        required = False, widget = forms.widgets.CheckboxInput(
            attrs={
                "class":"toggle-public-checkbox",
            }
        ), label="Public: "
    )

    bit_type = forms.CharField(required=True)

    class Meta:
        model = Bit
        fields = ('title','body', 'video', 'image', 'tags', 'is_public')
        
class ColorForm(forms.ModelForm):
    bit_background = forms.CharField(
        required=False, widget = forms.widgets.TextInput(
            attrs={
                "display":"none",
                "id":"primary-color",
            }
        )
    )
    accent_color = forms.CharField(
        required=False, widget = forms.widgets.TextInput(
            attrs={
                "display":"none",
                "id":"accent-color",
            }
        )
    )
    title_color = forms.CharField(
        required=False, widget = forms.widgets.TextInput(
            attrs={
                "display":"none",
                "id":"title-color",
                "class":"yb-form-color-field",
            }
        )
    )
    text_color = forms.CharField(
        required=False, widget = forms.widgets.TextInput(
            attrs={
                "display":"none",
                "id":"text-color",
                "class":"yb-form-color-field",
            }
        )
    )
    class Meta:
        model = Profile
        fields=['bit_background', 'accent_color', 'title_color','text_color']

