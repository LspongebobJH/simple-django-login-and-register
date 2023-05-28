# --------------------------------------------------------------
# Django imports
# --------------------------------------------------------------
from django import forms
from django.utils.translation import gettext_lazy as _


class InputForm(forms.Form):
    '''
    Basic form for our animal name suggestion form and logo generator form
    '''

    input = forms.CharField(max_length=100, required=True, label=_('Input'),
      widget=forms.TextInput(attrs={
        'placeholder': _('Give me something to work on...')}))

    # class Meta:
    #     fields = ('input',)

    @property
    def field_order(self):
        return ['input']