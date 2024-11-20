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
            if (action == "custom-bit") {
                //If yb_getsessionvalues("only-my-colors") is "True" set it to false
                let only_my_colors = yb_getSessionValues("only-my-colors");
                
                if (only_my_colors == "True") {
                    only_my_colors = false
                } else {
                    only_my_colors = true
                }

                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                    //Set user default to false, to ignore user color overridem and bit colors to false to remove all color overrides
                    yb_overrideBitColors(false, false);
                } else {
                    this.classList.add("active");
                    //Set user default to value of only_my_colors to decide if user color overrides should be applied set bit colors to true to apply color overrides
                    yb_overrideBitColors(only_my_colors, true);
                }

                
            }
            
        });
    }
});
