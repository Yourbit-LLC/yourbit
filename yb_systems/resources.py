
# yb_systems/Resources.py
# Yourbit, LLC -- 2023
# Author: Austin Chaney
# Date: 10/27/2023

# System resources for Yourbit.me
# This file contains functions that are used in multiple files.

from django.utils.text import slugify

def generate_unique_slug(model, description_body):
    base_slug = slugify(description_body)
    slug = base_slug
    counter = 1

    while model.objects.filter(slug=slug).exists():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug
