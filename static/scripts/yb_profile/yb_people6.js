
try{
    var filter_buttons = document.getElementsByClassName("people-filter");
    var list_container = document.getElementById('connection-list');
    var filter_value = "all";

} catch {
    list_container = document.getElementById()
    filter_buttons = document.getElementsByClassName("people-filter");
    filter_value = "all";
}

function clearPeopleList(){
    $(list_container).empty();
}

function yb_listPeople(filter){
    clearPeopleList();
    $(list_container).load(`/profile/people-list/${filter}/`);
}

function yb_disconnect(id) {
    //csrf token
    let csrf_token = getCSRF();
    $.ajax({
        type: 'POST',
        url: '/profile/disconnect/',
        data: {
            'id': id,
        },
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function(response) {
            document.getElementById('result-people-' + id).remove();
        },
        error: function(response) {
            console.log(response);
        }
    });

}

function yb_confirmDisconnect(id, name){
    let confirm = window.confirm(`Are you sure you want to disconnect from ${name}?`);
    if (confirm){
        yb_disconnect(id);
    }
}

$(document).ready(function () {
    // yb_hide2WayLoad();
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_listPeople(filter);
            for (let i = 0; i < filter_buttons.length; i++){
                filter_buttons[i].classList.remove("active");
            }
            this.classList.add("active");
        });
    }
});