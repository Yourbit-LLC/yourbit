try {
    var custom_panel_buttons = document.getElementsByClassName("yb-filter-icon");
} catch (e) {
    console.error(e);
    custom_panel_buttons = document.getElementsByClassName("yb-filter-icon");
}

$(document).ready(function() {
    console.log("custom-panel-ready");
    for (var i = 0; i < custom_panel_buttons.length; i++) {
        custom_panel_buttons[i].addEventListener('click', function() {
            console.log("panel button clicked");
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
