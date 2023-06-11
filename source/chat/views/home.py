from django.views import generic
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin

from chat.forms import InputForm

from ..utils.decorators import ajax_required
from ..utils.mixins import FormErrors

import openai

openai.api_key = settings.OPENAI_API_KEY

class HomeView(LoginRequiredMixin, generic.FormView):
    """
    FormView used for our home page.

    **Template:**

    :template:`index.html`
    """
    template_name = "chat/index.html"
    form_class = InputForm
    success_url = "/"
    login_url = "/accounts/log-in/"


    def generate_prompt(self, input):
        input = {'role': 'user', 'content': input}
        return input

    # TODO: what is ajax and how to cast an ajax request?
    # @method_decorator(ajax_required)
    def post(self, request):
        try:
            input = request.POST.get('prompt')
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[self.generate_prompt(input)],
                temperature=0.2,
            )
            response = response.get('choices')[0]['message']['content']
            return JsonResponse({'response': response})

        except Exception as e:
            print(e)
            return JsonResponse({'error': True, 'msg': str(e)})


