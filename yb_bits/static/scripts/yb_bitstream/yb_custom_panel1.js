try {
    var panel_buttons = document.getElementsByClassName("yb-filter-icon");
} catch (e) {
    console.error(e);
    panel_buttons = document.getElementsByClassName("yb-filter-icon");
}

$(document).ready(function() {
    console.log("sort-panel-ready");
    for (var i = 0; i < panel_buttons.length; i++) {
        panel_buttons[i].addEventListener('click', function() {
            let action = this.getAttribute("data-action");
            if (action == "custom-ui") {
                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                    yb_changeUIState('default');
                } else {
                    this.classList.add("active");
                    yb_changeUIState('modded');
                }
            }
            
        });
    }
});
