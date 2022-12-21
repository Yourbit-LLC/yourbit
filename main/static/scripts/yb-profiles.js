var base_url = window.location.origin;



$('#back-to-home').click(function() {
    window.location.href = `${base_url}/bitstream/home/`
});



//Swipe up element
$('.swipe-up-element').click(function() {
    console.log("clicked")
    let profile_splash = document.getElementById("profile-page-splash");
    let image = document.getElementById("profile-image-splash");
    let profile_id = $("#profile-page-splash").attr("data-id");

    $("#profile-splash-label").animate({"height": "130px", "top":"0", "width": "100%"});
    $("#splash-bio-container").css({"display": "none"});
    $("#profile-splash-label").css({"display": "grid", "text-align":"left", "grid-template-columns":"50px auto 120px", "padding-top":"230px"});
    $("#profile-name-header").css({"font-size":"15px", "margin-left":"10px", "margin-top":"20px"});
    $("#profile-handle-label").css({"font-size":"12px", "margin-left":"10px"});

    $(".button-profile-interaction").animate({"height": "35px", "width":"35px"});
    $(".button-profile-interaction").css({"pointer-events":"auto"});

    $("#profile-button-connect").html(`<svg class="profile-interact-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill:{{profile.bit_background}};" d="M5 19h1.4l8.625-8.625-1.4-1.4L5 17.6ZM19.3 8.925l-4.25-4.2 1.4-1.4q.575-.575 1.413-.575.837 0 1.412.575l1.4 1.4q.575.575.6 1.388.025.812-.55 1.387ZM17.85 10.4 7.25 21H3v-4.25l10.6-10.6Zm-3.525-.725-.7-.7 1.4 1.4Z"/></svg>`);
    $("#profile-button-message").html(`<svg class="profile-interact-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill:{{profile.bit_background}};" d="M1 20v-4q0-.85.588-1.425Q2.175 14 3 14h3.275q.5 0 .95.25.45.25.725.675.725.975 1.788 1.525Q10.8 17 12 17q1.225 0 2.288-.55 1.062-.55 1.762-1.525.325-.425.762-.675.438-.25.913-.25H21q.85 0 1.425.575Q23 15.15 23 16v4h-7v-2.275q-.875.625-1.887.95Q13.1 19 12 19q-1.075 0-2.1-.337-1.025-.338-1.9-.963V20Zm11-4q-.95 0-1.8-.438-.85-.437-1.425-1.212-.425-.625-1.062-.987Q7.075 13 6.325 13q.55-.925 2.325-1.463Q10.425 11 12 11q1.575 0 3.35.537 1.775.538 2.325 1.463-.725 0-1.375.363-.65.362-1.075.987-.55.8-1.4 1.225Q12.975 16 12 16Zm-8-3q-1.25 0-2.125-.875T1 10q0-1.275.875-2.138Q2.75 7 4 7q1.275 0 2.138.862Q7 8.725 7 10q0 1.25-.862 2.125Q5.275 13 4 13Zm16 0q-1.25 0-2.125-.875T17 10q0-1.275.875-2.138Q18.75 7 20 7q1.275 0 2.138.862Q23 8.725 23 10q0 1.25-.862 2.125Q21.275 13 20 13Zm-8-3q-1.25 0-2.125-.875T9 7q0-1.275.875-2.138Q10.75 4 12 4q1.275 0 2.137.862Q15 5.725 15 7q0 1.25-.863 2.125Q13.275 10 12 10Z"/></svg>`);
    $("#profile-button-about").html(`<svg class="profile-interact-icon" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path style="fill:{{profile.bit_background}};" d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-7L4 8v10h16V8Zm0-2 8-5H4ZM4 8V6v12Z"/></svg>`);
    
    $(".swipe-up-element").animate({"top": "0", "opacity": "0"}, "fast")
    $(".swipe-up-element").fadeOut("fast");
    
    $("#profile-page-splash").animate({"height":"120px"});
    $("#profile-page-splash").css({"height":"120px", "pointer-events":"none"});
    $(".large-profile-image").animate({"height":"50px", "width":"50px"});

    $(".large-profile-image").css({"grid-column":"1"});
    $("#profile-name-splash").css({"grid-column":"2"});
    $(".profile-interaction-container").css({"grid-column": "3", "grid-template-columns": "40px 40px 40px", "margin-top":"0px", "text-align":"center", "height":"80px"})

    let new_feed = {
        "type": "global",
        "id":`${profile_id}`,
        "filter":"all",
        "sort":"chrono",
    };

    console.log(new_feed)

    getFeed(new_feed, "none", false);
    
});


$('.button-profile-interaction').click(function() {
    console.log("clicked")
    let button_name = $(this).attr('name');
    if (button_name === 'request_friend') {
        let dropdown = yb_createElement("div", "splash-dropdown", "dropdown-menu");
        let add_friend = yb_createElement("p", "option-follow", "dropdown-option");
        let follow = yb_createElement("p", "option-message", "dropdown-option");
        
        dropdown.appendChild(add_friend);
        dropdown.appendChild(follow);

        $(this).append(dropdown)
        
        let user_id = $(this).attr('data-catid');
        requestFriend(button_name, user_id);

    }

    if (button_name === 'follow') {
        let user_id = $(this).attr('data-catid');
        follow(button_name, user_id);
    }

});

    // $('.profile-button').click(function() {
    //     let button_name = $(this).attr('name');
    //     if (button_name === 'request_friend') {
    //         let user_id = $(this).attr('data-catid');
    //         requestFriend(button_name, user_id);

    //     }

    // });

function requestFriend(action, user_id) {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    let friend_request = new FormData()
    friend_request.append('user_id', user_id)
    friend_request.append('action', action)
    $.ajax (
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: '/profile/add_friend/',
            data: friend_request,

            success: function(data) {
                let response = data;
                let to_user = data.name;
                let body = `Friend request to ${to_user} sent`;
                showNotification(expandNotification, body);
            }
        }
    )
}
function follow() {
    let cookie = document.cookie;
    let csrfToken = getCSRF();
    $.ajax(
        {
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: '/profile/follow/',
        data: {
            profile: profile
        },
        success: function(data) {
            let response = data;
            let from_user = response.from_user
            let to_user = response.to_user;

            /*Notify both parties of success*/
            let type = 3;
            Notify(type, from_user, to_user)

        }
    }

    )
}
