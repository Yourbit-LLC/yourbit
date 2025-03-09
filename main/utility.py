

def safe_fstring(template, **kwargs):
    return template.format(**{key: kwargs.get(key, f"<{key}>") for key in kwargs})

