from django import forms
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm


from yb_accounts.models import Account
from yb_settings.models import PrivacySettings




class DateInput(forms.DateInput):
    input_type = 'date'

class RegistrationForm(UserCreationForm):
    email = forms.EmailField(max_length=60, help_text='*Required')
    dob = forms.DateField(help_text='*Required',widget=DateInput)
    
    class Meta:
        model = Account
        fields = ("email", "username", "first_name", "last_name", "dob", "password1", "password2")

    def __init__(self, *args, **kwargs):
        super(RegistrationForm, self).__init__(*args, **kwargs)

        #Classes
        self.fields['email'].widget.attrs.update({'class': 'field'})
        
        self.fields['username'].widget.attrs.update({'class': 'field'})
        self.fields['first_name'].widget.attrs.update({'class': 'field'})
        self.fields['last_name'].widget.attrs.update({'class': 'field'})
        self.fields['dob'].widget.attrs.update({'class': 'field'})
        self.fields['password1'].widget.attrs.update({'class': 'field'})
        self.fields['password2'].widget.attrs.update({'class': 'field'})

                
        self.fields['username'].widget.attrs.update({'id': 'id_username_new'})
        self.fields['first_name'].widget.attrs.update({'id': 'id_first_name_new'})
        self.fields['last_name'].widget.attrs.update({'id': 'id_last_name_new'})
        self.fields['dob'].widget.attrs.update({'id': 'id_dob_new'})
        
        #Placeholders
        self.fields['email'].widget.attrs.update({'placeholder': 'Email'})
        
        self.fields['username'].widget.attrs.update({'placeholder': 'Username'})
        self.fields['first_name'].widget.attrs.update({'placeholder': 'First Name'})
        self.fields['last_name'].widget.attrs.update({'placeholder': 'Last Name'})
        self.fields['dob'].widget.attrs.update({'placeholder': 'Birthday'})
        self.fields['password1'].widget.attrs.update({'placeholder': 'Password'})
        self.fields['password2'].widget.attrs.update({'placeholder': 'Confirm Password'})
        
        #Types
        
        self.fields['dob'].widget.attrs.update({'type': 'date'})

class LoginForm(forms.ModelForm):
    password = forms.CharField(label='Password', widget=forms.PasswordInput)
    
    class Meta:
        model = Account
        fields = ('username', 'password')

    def clean(self):
        username = self.cleaned_data['username']
        password = self.cleaned_data['password']
        if not authenticate(username=username, password=password):
            raise forms.ValidationError("Invalid Login")

    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)

        self.fields['username'].widget.attrs.update({'class': 'field'})
        self.fields['password'].widget.attrs.update({'class': 'field'})

        self.fields['username'].widget.attrs.update({'placeholder': 'Username'})
        self.fields['password'].widget.attrs.update({'placeholder': 'Password'})

        