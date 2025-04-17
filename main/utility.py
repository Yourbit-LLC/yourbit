
from django.shortcuts import render

def generate_bs_filter_chain(feed_settings):
    #Build filter chain
    filter_chain = ""
    if feed_settings.show_friends:
        filter_chain += '-fr'
    
    if feed_settings.show_following:
        filter_chain += '-fo'
    
    if feed_settings.show_communities:
        filter_chain += '-co'

    if feed_settings.show_public:
        filter_chain += '-p'

    if feed_settings.show_my_bits:
        filter_chain += '-me'

    return filter_chain

def update_bs_filter_chain(profile, filter_chain):
    from yb_settings.models import FeedSettings, MySettings
    from yb_profile.models import Profile

    my_settings = MySettings.objects.get(profile=profile)
    feed_settings = FeedSettings.objects.get(settings=my_settings)

    #Update filter chain
    if 'fr' in filter_chain:
        feed_settings.show_friends = True
    else:
        feed_settings.show_friends = False
    
    if 'fo' in filter_chain:
        feed_settings.show_following = True
    else:
        feed_settings.show_following = False
    
    if 'co' in filter_chain:
        feed_settings.show_communities = True
    else:
        feed_settings.show_communities = False

    if 'p' in filter_chain:
        feed_settings.show_public = True
    else:
        feed_settings.show_public = False

    if 'me' in filter_chain:
        feed_settings.show_my_bits = True
    else:
        feed_settings.show_my_bits = False

    feed_settings.save()


def initialize_session(request):
    from yb_settings.models import MySettings, FeedSettings
    from yb_systems.models import TaskManager
    from yb_profile.models import Profile
    print(request)
    this_user = request.user
    active_profile = Profile.objects.get(username=this_user.active_profile)
    these_settings = MySettings.objects.get(profile=active_profile)
    this_state = TaskManager.objects.get(user=active_profile)
    last_location = this_state.current_location
    
    #Get active feed settings
    feed_settings = FeedSettings.objects.get(settings=these_settings)
    default_space = feed_settings.default_space

    if default_space == 'auto':
        current_space = feed_settings.current_space

    else:
        current_space = default_space
    
    sort_by = feed_settings.sort_by

    #Build filter chain
    filter_chain = generate_bs_filter_chain(feed_settings)

    return {
        "last_location": last_location,
        "current_space": current_space, 
        "sort_by": sort_by, 
        "filter_chain": filter_chain
    }

def safe_fstring(template, **kwargs):
    return template.format(**{key: kwargs.get(key, f"<{key}>") for key in kwargs})

def bundle_view(request, bundle_id):
    init_params = initialize_session(request)
    return render(
        request, 
        "main/index.html",
        {
            'first_login': request.user.first_login,
            'location': init_params['last_location'],
            'space': init_params['current_space'],
            'filter': init_params['filter_chain'],
            'sort': init_params['sort_by'],   
            'start_function': 'yb_navigateTo("2way", "settings-profile"); yb_startBitStream();',    
        },

    )

