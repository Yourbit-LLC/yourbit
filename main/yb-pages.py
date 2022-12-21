
#               feed/yb-pages.py
#               11/13/2022
#               Yourbit, LLC

#Description: Stores functions containing HTML for dynamic pages


#Functions for assembling page responses


def Profile(profile_data):
    #Get profile image from data
    profile_image = profile_data.get('profile_image')
    
    #Get profile name from data 
    profile_name = profile_data.get('profile_name')

    #Get username from data 
    handle = profile_data.get('profile_handle')

    #Get motto from data
    motto = profile_data.get('profile_motto')

    #Get bio from data
    bio = profile_data.get('profile_bio')

    #Create Profile Splash
    profile_splash = f"""
        <div class='splash-page' id='profile-page-splash'>
            <div class='space-splash-label'>
                <img class='large-profile-image' src="{profile_image}">
                <h2>{profile_name}</h2>
                <h3>@{handle}</h3>
                <div class='profile-interaction-conainer'>
                    <button>Add Friend</button>
                    <button>Message</button>
                    <button>About</button>
                </div>
            </div>
            <div class='splash-bio-container'>
                <h3>{motto}</h3>
                <p>{bio}</h3>
            </div>
            <div class='swipe-up-element'>
                <svg class='swipe-up-icon' xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z"/></svg>
                <p class='swipe-up-text'>Slide Up for Bitstream</p>
            </div>
        </div>
    
    """

    return profile_splash
