try {
    var filter_buttons = document.getElementsByClassName("orbit-filter");
} catch {
    filter_buttons = document.getElementsByClassName("orbit-filter");
}

function yb_listOrbits(filter){
    $.ajax({
        type: 'GET',
        url: '/orbits/',
        data: {
            filter: filter
        },
        success: function(response){
            let orbits_container = document.getElementById("orbits-container");
            orbits_container.innerHTML = "";
            for (let i = 0; i < response.orbits.length; i++){
                let orbit = response.orbits[i];
                let this_id = orbit.id;
                let this_name = orbit.name;
                let this_image = orbit.image_thumbnail_small;
                let this_primary_color = orbit.primary_color;
                let this_unread = orbit.unread;
                let this_blueprint = {
                    "id": this_id,
                    "name": this_name,
                    "image": this_image,
                    "primary_color": this_primary_color,
                    "unread": this_unread,
                }
                let display_orbit = yb_buildContactItem(this_blueprint);
                orbits_container.appendChild(display_orbit);
            }
        }
    });
}

$(document).ready(function () {
    // yb_hide2WayLoad();
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_listOrbits(filter);
        });
    }
});