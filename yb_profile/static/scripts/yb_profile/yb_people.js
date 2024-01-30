let filter_buttons = document.getElementsByClassName("people-filter");

function yb_listPeople(filter){
    $.ajax({
        type: 'GET',
        url: '/people/',
        data: {
            filter: filter
        },
        success: function(response){
            let people_container = document.getElementById("people-container");
            people_container.innerHTML = "";
            for (let i = 0; i < response.people.length; i++){
                let person = response.people[i];
                let this_id = person.id;
                let this_name = person.name;
                let this_image = person.image_thumbnail_small;
                let this_primary_color = person.primary_color;
                let this_unread = person.unread;
                let this_blueprint = {
                    "id": this_id,
                    "name": this_name,
                    "image": this_image,
                    "primary_color": this_primary_color,
                    "unread": this_unread,
                }
                let display_person = yb_buildContactItem(this_blueprint);
                people_container.appendChild(display_person);
            }
        }
    });
}

$(document).ready(function () {
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_listPeople(filter);
        });
    }
});