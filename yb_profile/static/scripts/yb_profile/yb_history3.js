try {
    var filter_buttons = document.getElementsByClassName("history-filter");
    var list_container = document.getElementById("history-list");
} catch {
    filter_buttons = document.getElementsByClassName("history-filter");
    list_container = document.getElementById("history-list");
}

function yb_getHistory(filter, button) {
    list_container.innerHTML = "";
    $(list_container).load("/profile/history-list/" + filter + "/");
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].classList.remove("active");
    }
    button.classList.add("active");

}

/* On document ready assign event listeners to page specific buttons */
$(document).ready(function () {
    // yb_hide2WayLoad();
    for (let i = 0; i < filter_buttons.length; i++){
        filter_buttons[i].addEventListener('click', function() {
            let filter = this.getAttribute("name");
            yb_getHistory(filter, this);
        });
    }
});
