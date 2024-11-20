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
            else if (action == "custom-bit") {
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
                    yb_setSessionValues("bit-colors-on", "False");
                } else {
                    this.classList.add("active");
                    //Set user default to value of only_my_colors to decide if user color overrides should be applied set bit colors to true to apply color overrides
                    yb_overrideBitColors(only_my_colors, true);
                    yb_setSessionValues("bit-colors-on", "True");
                }

                
            } else if (action == "only-my-colors") {
                //If yb_getsessionvalues("only-my-colors") is "True" set it to false

                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                    yb_overrideBitColors(false, true);
                    yb_setSessionValues("only-my-colors", "False");
                } else {
                    this.classList.add("active");
                    yb_overrideBitColors(true, true);
                    yb_setSessionValues("only-my-colors", "True");
                    
                }
            } else if (action == "wallpaper") {
                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                    CONTENT_CONTAINER_A.classList.remove("yb-bg-transparent");
                    CONTENT_CONTAINER_A.classList.add("yb-bg-autoGray");
                    CONTENT_CONTAINER_B.classList.remove("yb-bg-transparent");
                    CONTENT_CONTAINER_B.classList.add("yb-bg-autoGray");
                    yb_setCustomValues("wallpaper", "False");
                } else {
                    this.classList.add("active");
                    CONTENT_CONTAINER_A.classList.remove("yb-bg-autoGray");
                    CONTENT_CONTAINER_A.classList.add("yb-bg-transparent");
                    CONTENT_CONTAINER_B.classList.remove("yb-bg-autoGray");
                    CONTENT_CONTAINER_B.classList.add("yb-bg-transparent");
                    let wallpaper = yb_getWallpaper(profile);
                    yb_loadWallpaper(wallpaper);
                    yb_setCustomValues("wallpaper", "True");
                }
            }
            
        });
    }
});
