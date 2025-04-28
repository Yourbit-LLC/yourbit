from django import forms
from yb_bits.models import Bit, Cluster
from yb_profile.models import Profile

class ProfilePictureUpload(forms.ModelForm):
    image = forms.FileField(required=True)

    def __init__(self, *args, **kwargs):
        super(ProfilePictureUpload, self).__init__(*args, **kwargs)
        self.fields['image'].widget.attrs.update({'name': 'profile_image_field', 'class':'profile-image-field', 'id':'profile-image-field'})


    class Meta:
        model = Profile
        fields = ('image',)
        exclude = ("user", )

class UserBackgroundPictureUpload(forms.ModelForm):
    background_image = forms.FileField(required=True)
    def __init__(self, *args, **kwargs):
        super(UserBackgroundPictureUpload, self).__init__(*args, **kwargs)
        self.fields['background_image'].widget.attrs.update({'name': 'background_image_field', 'class':'profile-image-field', 'id':'bkd-image-field'})
    class Meta:
        model = Profile
        fields = ('background_image',)
        exclude = ("user",)

class CommunityBackgroundPictureUpload(forms.ModelForm):
    background_image = forms.FileField(required=True)
    def __init__(self, *args, **kwargs):
        super(CommunityBackgroundPictureUpload, self).__init__(*args, **kwargs)
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
            "id": "bb-field-title",
            "class": "yb-builderBit yb-tform-cntrOrigin bb-field yb-font-auto squared font-large font-heavy align-center border-solid narrowBorder",
            "style": ""
            }
        ), label="",
    )
    body = forms.CharField(
        required=False, widget = forms.widgets.Textarea(
        attrs={
            "placeholder": "Description",
            "id": "bb-field-body",
            "class": "yb-builderBit yb-tform-cntrOrigin bb-field bg-gray-dark yb-font-auto squared font-medium align-left border-solid narrowBorder"
            }
        ), label="",
    )

    video = forms.FileField(
        required=False, widget = forms.widgets.FileInput(
            attrs={
                "class":"bb-fileField",
            }
        ), label="",
    )

    image = forms.FileField(
        required=False, widget = forms.widgets.FileInput(
            attrs={
                "class":"bb-fileField",
            }
        ), label="",
    )

    tags = forms.CharField(
        required=False, widget = forms.widgets.Textarea(
            attrs={
                "placeholder":"Tags",
                "id":"bb-field-tags",
                "class":"yb-builderBit yb-tform-cntrOrigin bb-field bg-gray-dark yb-font-auto squared font-medium align-left border-solid narrowBorder",
            }
        ), label = "",
    )

    is_public = forms.BooleanField(
        required = True, widget = forms.widgets.CheckboxInput(
            attrs={
                "class":"toggle-public-checkbox",
            }
        ), label="Public: "
    )

    shoutouts = forms.CharField(
        required=False, widget = forms.widgets.Textarea(
            attrs={
                "placeholder":"Search Connections",
                "id":"bb-field-bitShoutouts",
                "class": "yb-builderBit yb-tform-cntrOrigin bb-field bg-gray-dark yb-font-auto rounded font-heavy align-left border-solid narrowBorder",
            }
        ), label = "",
    )
    
    bit_type = forms.CharField(required=True)

    class Meta:
        model = Bit
        fields = ('title','body', 'video', 'image', 'tags', 'is_public')
        
class ClusterForm():
    class Meta:
        model = Cluster
        fields = ('title', 'description', 'tags', 'is_public')


