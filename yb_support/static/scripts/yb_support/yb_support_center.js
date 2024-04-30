try {
    var BUG_REPORT_BUTTON = document.getElementById("yb-button-bug-report");
    var REQUEST_FEAUTURE_BUTTON = document.getElementById("yb-button-request-feature");
    var CONTACT_INFO_BUTTON = document.getElementById("yb-button-contact-info");
} catch(err) {
    BUG_REPORT_BUTTON = document.getElementById("yb-button-bug-report");
    REQUEST_FEAUTURE_BUTTON = document.getElementById("yb-button-request-feature");
    CONTACT_INFO_BUTTON = document.getElementById("yb-button-contact-info");
}



function yb_navigateToSupportForm(e){
    let this_button = e.currentTarget;
    let name = this_button.getAttribute("name");
    let container = yb_toggle2WayContainer(name, true);
    if (container[0] != "closing"){
        
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", name);
        $(container_content).load("/support/templates/" + name + "/");
        history.pushState({}, "", '/support/' + name + '/');
    } else {
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    }

}

$(document).ready(function() {
    BUG_REPORT_BUTTON.addEventListener("click", yb_navigateToSupportForm);

    REQUEST_FEAUTURE_BUTTON.addEventListener("click", yb_navigateToSupportForm);

    CONTACT_INFO_BUTTON.addEventListener("click", yb_navigateToSupportForm);
});