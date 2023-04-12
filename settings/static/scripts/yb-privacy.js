//This is the instance script to atttach to the privacy settings page


function PrefillForm() {
    var form = document.getElementById("privacy-form");

    yb_showBackTask();

    $.ajax({
        url: "/settings/api/privacy/",
        type: "GET",
        dataType: "json",
        success: function (data) {
            let followers_enabled = data.enable_followers;
            let default_public = data.default_public;
            

            $("#yb-check-enable-follow").prop("checked", followers_enabled);
            $("#yb-check-default-public").prop("checked", default_public);
            $("#yb-check-enable-share").prop("checked", data.enable_share);
            $("#yb-check-show-rep").prop("checked", data.show_reputation);
            $("#yb-check-reach").prop("checked", data.friends_of_friends);
            

            $("#yb-check-real-search").prop("checked", data.search_by_name);
            const REAL_NAME_SELECT = document.getElementById("yb-select-real-name");
            REAL_NAME_SELECT.value = data.real_name_visibility;

            const BIRTHDAY_SELECT = document.getElementById("yb-select-birthday");
            BIRTHDAY_SELECT.value = data.birthday_visibility;

            const PHONE_NUM_SELECT = document.getElementById("yb-phone-number-select");
            PHONE_NUM_SELECT.value = data.phone_number_visibility;

            const EMAIL_SELECT = document.getElementById("yb-select-email");
            EMAIL_SELECT.value = data.email_visibility;

            const FRIEND_COUNT_SELECT = document.getElementById("yb-select-friend-count");
            FRIEND_COUNT_SELECT.value = data.friend_count_visibility;

            const FOLLOW_COUNT_SELECT = document.getElementById("yb-select-follow-count");
            FOLLOW_COUNT_SELECT.value = data.follower_count_visibility;



        }
    })

}

document.onload = PrefillForm();