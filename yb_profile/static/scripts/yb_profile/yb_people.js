
try{
    var filter_buttons = document.getElementsByClassName("people-filter");
    var list_container = document.getElementById('connection-list');

} catch {
    list_container = document.getElementById()
    filter_buttons = document.getElementsByClassName("people-filter");
}

function clearPeopleList(){
    $(list_container).empty();
}

function yb_listPeople(filter){
    clearPeopleList();
    $(list_container).load(`/profile/people-list/${filter}/`);
}

$(document).ready(function () {
    // yb_hide2WayLoad();
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_listPeople(filter);
        });
    }
});