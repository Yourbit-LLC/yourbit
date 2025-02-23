try {
    var custom_panel_buttons = document.getElementsByClassName("yb-filter-icon");
    var only_my_colors_button = document.getElementById("only-my-colors-button");
} catch (e) {
    console.error(e);
    custom_panel_buttons = document.getElementsByClassName("yb-filter-icon");
    only_my_colors_button = document.getElementById("only-my-colors-button");
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
                    sendUIToggle();
                    yb_changeUIState('default');
                } else {
                    this.classList.add("active");
                    sendUIToggle();
                    yb_changeUIState('modded');
                }
            }
            else if (action == "custom-bit") {
                //If yb_getsessionvalues("only-my-colors") is "True" set it to false
                let only_my_colors = yb_getSessionValues("only-my-colors");
                
                if (only_my_colors == "True") {
                    only_my_colors = true
                } else {
                    only_my_colors = false
                }

                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                    //Set user default to false, to ignore user color overridem and bit colors to false to remove all color overrides
                    yb_overrideBitColors(false, false);
                    only_my_colors_button.classList.add("yb-half-opacity");
                    yb_sendBitToggle("off");
                    yb_setSessionValues("bit-colors-on", "False");
                } else {
                    this.classList.add("active");
                    //Set user default to value of only_my_colors to decide if user color overrides should be applied set bit colors to true to apply color overrides
                    yb_overrideBitColors(only_my_colors, true);
                    only_my_colors_button.classList.remove("yb-half-opacity");
                    yb_sendBitToggle("on");
                    yb_setSessionValues("bit-colors-on", "True");
                }

                
            } else if (action == "only-my-colors") {
                //If yb_getsessionvalues("only-my-colors") is "True" set it to false

                if (this.classList.contains("active")) {
                    this.classList.remove("active");
                    yb_overrideBitColors(false, true);
                    yb_omcBitToggle();
                    yb_setSessionValues("only-my-colors", "False");
                } else {
                    this.classList.add("active");
                    yb_overrideBitColors(true, true);
                    yb_omcBitToggle();
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
            } else if (action == "flat-mode") {
                if (this.classList.contains("active")) {
                    yb_setCustomValues("flat-mode-on", "False");

                    CUSTOM_CONFIG["flat-mode-on"] = "False";

                    if (CUSTOM_CONFIG["wallpaper-on"] == "True") {
                        CONTENT_CONTAINER_A.classList.remove("yb-bg-autFlat");
                        CONTENT_CONTAINER_A.classList.add("yb-bg-transparent");
                        CONTENT_CONTAINER_B.classList.remove("yb-bg-autoFlat");
                        CONTENT_CONTAINER_B.classList.add("yb-bg-transparent");
                    } else {
                        CONTENT_CONTAINER_A.classList.remove("yb-bg-autoFlat");
                        CONTENT_CONTAINER_A.classList.add("yb-bg-autoGray");
                        CONTENT_CONTAINER_B.classList.remove("yb-bg-autoFlat");
                        CONTENT_CONTAINER_B.classList.add("yb-bg-autoGray");
                    }

                    if (yb_getCustomValues("custom-ui-on") == "True") {
                        yb_changeUIState("modded");
                    } else {
                        yb_changeUIState("default");
                    }

                    if (CUSTOM_CONFIG["wallpaper-on"] == "True") {
                        let only_my_colors = yb_getSessionValues("only-my-colors");
                        if (only_my_colors == "True") {
                            yb_swapSheets("modded", "yb-stylesheet-bit");
                            yb_overrideBitColors(true, true);
                        } else {
                            //check media for dark mode
                            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                                document.documentElement.style.setProperty('--default-bit-background', 'rgb(70, 70, 70)');
                            } else {
                                document.documentElement.style.setProperty('--default-bit-background', 'rgb(255, 255, 255)');
                                yb_overrideBitColors(false, true);
                            }
                            yb_overrideBitColors(false, false);
                        }

                        
                    } else {
                        yb_overrideBitColors(false, false);
                    }

                    this.classList.remove("active");
                

                } else {
                    yb_changeUIState("default");
                    yb_swapSheets("default", "yb-stylesheet-bit");
                    yb_overrideBitColors(false, false);
                    CUSTOM_CONFIG["flat-mode-on"] = "True";
                    yb_setCustomValues("custom-ui-on", "False");
                    yb_setCustomValues("bit-colors-on", "False");
                    //update root variables
                    document.documentElement.style.setProperty('--yb-separator-display', 'block');
                    if (CUSTOM_CONFIG["wallpaper-on"] == "True") {
                        document.getElementById("content-container-a").classList.remove("yb-bg-transparent");
                        document.getElementById("content-container-a").classList.add("yb-bg-autoFlat");
                        document.getElementById("content-container-b").classList.remove("yb-bg-transparent");
                        document.getElementById("content-container-b").classList.add("yb-bg-autoFlat");
                    } else {
                        document.getElementById("content-container-a").classList.remove("yb-bg-autoGray");
                        document.getElementById("content-container-a").classList.add("yb-bg-autoFlat");
                        document.getElementById("content-container-b").classList.remove("yb-bg-autoGray");
                        document.getElementById("content-container-b").classList.add("yb-bg-autoFlat");
                    }

                    for (bit in bit_elements) {
                        try{
                            bit_elements[bit].style.backgroundColor = "transparent";
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    this.classList.add("active");
                }

                sendFlatModeToggle();

            }
        });
    }
});
