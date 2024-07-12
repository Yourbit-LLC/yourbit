try {
    var filter_buttons = document.getElementsByClassName("history-filter");
} catch {
    filter_buttons = document.getElementsByClassName("history-filter");
}

function yb_getStuff(filter) {
    $.ajax({
        type: 'GET',
        url: '/stuff/',
        data: {
            filter: filter
        },
        success: function(response){
            let stuff_container = document.getElementById("stuff-container");
            stuff_container.innerHTML = "";
            for (let i = 0; i < response.stuff.length; i++){
                let stuff = response.stuff[i];
                let this_id = stuff.id;
                let this_name = stuff.name;
                let this_image = stuff.image_thumbnail_small;
                let this_primary_color = stuff.primary_color;
                let this_unread = stuff.unread;
                let this_blueprint = {
                    "id": this_id,
                    "name": this_name,
                    "image": this_image,
                    "primary_color": this_primary_color,
                    "unread": this_unread,
                }
                let display_stuff = yb_buildListItem(this_blueprint);
                stuff_container.appendChild(display_stuff);
            }
        }
    });
}

$(document).ready(function () {
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_getStuff(filter);
        });
    }
});
