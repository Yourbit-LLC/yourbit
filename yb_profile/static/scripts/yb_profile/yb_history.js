try {
    let filter_buttons = document.getElementsByClassName("history-filter");
} catch {
    filter_buttons = document.getElementsByClassName("history-filter");
}

function yb_getHistory(filter) {
    $.ajax({
        type: 'GET',
        url: '/history/',
        data: {
            filter: filter
        },
        success: function(response){
            let history_container = document.getElementById("history-container");
            history_container.innerHTML = "";
            for (let i = 0; i < response.history.length; i++){
                let history = response.history[i];
                let this_id = history.id;
                let this_name = history.name;
                let this_image = history.image_thumbnail_small;
                let this_primary_color = history.primary_color;
                let this_unread = history.unread;
                let this_blueprint = {
                    "id": this_id,
                    "name": this_name,
                    "image": this_image,
                    "primary_color": this_primary_color,
                    "unread": this_unread,
                }
                let display_history = yb_buildListItem(this_blueprint);
                history_container.appendChild(display_history);
            }
        }
    });
}

/* On document ready assign event listeners to page specific buttons */
$(document).ready(function () {
    yb_hide2WayLoad();
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_getHistory(filter);
        });
    }
});
