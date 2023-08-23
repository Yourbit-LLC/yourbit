from django.urls import reverse

def subdomain_reverse(viewname, subdomain, *args, **kwargs):
    url = reverse(viewname, args=args, kwargs=kwargs)
    if subdomain:
        return f'http://{subdomain}.yourbit.me{url}'
    return url