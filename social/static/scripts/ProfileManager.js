var base_url = window.location.origin;

$(document).ready(function() {
    $('#back-to-home').fadeIn('slow');
    $('#back-to-home').animate({'bottom': '90px'});
    
});

$('#back-to-home').click(function() {
    window.location.href = `${base_url}/social/home`
});

$('.profile-interact-icon').click(function() {
    let button_name = $(this).attr('name');
    if (button_name === 'request_friend') {
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
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
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
            url: '/social/add_friend/',
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
    let csrfToken = cookie.substring(cookie.indexOf('=') + 1);
    $.ajax(
        {
        type: "POST",
        headers: {
            'X-CSRFToken': csrfToken
        },
        url: '/social/follow/',
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

