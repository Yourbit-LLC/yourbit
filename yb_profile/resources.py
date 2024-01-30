# user_profile/Resources.py
# Yourbit, LLC -- 2023
# Author: Austin Chaney
# Date: 10/25/2023

# Profile resources for Yourbit.me
# This file contains functions that are used in multiple files.

#Check user to user permissions on a media object
def get_object_permissions(profile, resource):
    
    if resource.is_private:
        this_profile = resource.profile
        if this_profile != profile:
            if this_profile in profile.connections.all():
                return True
            else:
                return False
        else:
            return True
    else:
        return True

#Check user to user permissions on a profile object
def get_profile_permissions(profile, resource):
    
    if resource.is_private:
        if resource != profile:
            if resource in profile.connections.all():
                return True
            else:
                return False
        else:
            return True
    else:
        return True