/*
    yb_customCore.js
    Yourbit, LLC, 2024
    Author: Austin Chaney
    Created: 7/11/2024
*/


// THe element that stores user customization values


    const CUSTOM_VALUES = document.getElementById("user-custom-info");

    /*
        --Background Image Containers--
        These are used to display the background image on the page
        The source of the image is set dynamically based on the user's settings

        The BG_IMAGE_A container is used to display the user image
        The BG_IMAGE_B container is used to display other users images on their profiles

        The BG_IMAGE_SOURCE_A and BG_IMAGE_SOURCE_B containers are used to set the source of the image dynamically

    */
    const BG_IMAGE_A = document.getElementById("bg-image-a");
    const BG_IMAGE_SOURCE_A = document.getElementById("bg-image-source-a");

    const BG_IMAGE_B = document.getElementById("bg-image-b");
    const BG_IMAGE_SOURCE_B = document.getElementById("bg-image-source-b");

    const CUSTOM_CONFIG = {
        "wallpaper-on": CUSTOM_VALUES.getAttribute("data-wallpaper-on"),
        "custom-ui-on": CUSTOM_VALUES.getAttribute("data-custom-ui-on"),
        "flat-mode-on": CUSTOM_VALUES.getAttribute("data-flat-mode-on"),
        "bit-colors-on": CUSTOM_VALUES.getAttribute("data-bit-colors-on"),
        "only-my-colors": CUSTOM_VALUES.getAttribute("data-only-my-colors"),
    }

    const WALLPAPER_SETTINGS = {
        "wallpaper": CUSTOM_VALUES.getAttribute("data-wallpaper"),  
        "wallpaper-on": CUSTOM_VALUES.getAttribute("data-wallpaper-on"),
        "wallpaper-blur": CUSTOM_VALUES.getAttribute("data-wallpaper-blur"),
        "wallpaper-brightness": CUSTOM_VALUES.getAttribute("data-wallpaper-brightness"),
        "wallpaper-hue": CUSTOM_VALUES.getAttribute("data-wallpaper-hue"),
    }

    /*
        --Custom Index--
        The suffix to the root variable names will match the key in each object

        When adding new custom values to the index ensure that the key matches the suffix

        Example: --yb-bit-primary-color will match the key "primary-color" in the BIT_CUSTOM object

        This is used to dynamically change the CSS variables in the main stylesheet

    */
    const BIT_CUSTOM = {
        "primary-color": CUSTOM_VALUES.getAttribute("data-bit-primary-color"),
        "secondary-color": CUSTOM_VALUES.getAttribute("data-bit-secondary-color"),
        "title-color": CUSTOM_VALUES.getAttribute("data-bit-title-color"),
        "text-color": CUSTOM_VALUES.getAttribute("data-bit-text-color"),
        "icon-color": CUSTOM_VALUES.getAttribute("data-bit-icon-color"),
        "button-color": CUSTOM_VALUES.getAttribute("data-bit-button-color"),
    }

    const UI_CUSTOM = {
        "panel-color": CUSTOM_VALUES.getAttribute("data-ui-panel-color"),
        "accent-color": CUSTOM_VALUES.getAttribute("data-ui-accent-color"),
        "text-color": CUSTOM_VALUES.getAttribute("data-ui-text-color"),
        "icon-color": CUSTOM_VALUES.getAttribute("data-ui-icon-color"),
        "title-color": CUSTOM_VALUES.getAttribute("data-ui-title-color"),
        "button-color": CUSTOM_VALUES.getAttribute("data-ui-button-color"),
        "button-text-color": CUSTOM_VALUES.getAttribute("data-ui-button-text-color"),
    }

/*
    --Stylesheet Index--
    The key will match the id of the link element in the head of the document
    The value will be the path to the stylesheet

    When adding new stylesheets ensure that the key matches the id of the link element
    Both the default and modded indexes should have the same keys

    When iterating filenames ensure that URL's are updated in both, the link tags in the base.html file,
    and the index objects

    Example: "yb-stylesheet-core" will match the id of the link element in the head of the document

    This is used to dynamically change the stylesheet of the document



*/
const DEFAULT_STYLESHEET_INDEX = {
    "yb-stylesheet-core": "/static/css/main/yb_core8.css",
    "yb-stylesheet-modifier": "/static/css/main/yb_modifiers4.css",
    "yb-stylesheet-button": "/static/css/main/yb_buttons6.css",
    "yb-stylesheet-container": "/static/css/main/yb_containers9.css",
    "yb-stylesheet-bit": "/static/css/yb_bits/yb_bits7.css",
}

const MODDED_STYLESHEET_INDEX = {
    "yb-stylesheet-core": "/static/css/main/yb_core_customized11.css",
    "yb-stylesheet-modifier": "/static/css/main/yb_modifiers_customized5.css",
    "yb-stylesheet-button": "/static/css/main/yb_buttons_customized9.css",
    "yb-stylesheet-container": "/static/css/main/yb_containers_customized1.css",
    "yb-stylesheet-bit": "/static/css/yb_bits/yb_bits_customized8.css",
}

//Legacy custom index **MARKED FOR REMOVAL**
const custom_ui_index = [
    'panel-color',
    'accent-color',
    'text-color',
    'icon-color',
    'title-color',
    'button-color',
    'button-text-color'
]

const custom_bit_index = [
    'primary-color',
    'secondary-color',
    'title-color',
    'text-color',
    'icon-color',
    'button-color'
]

function sendUIToggle() {
    let csrf_token = getCSRF();

    $.ajax({
        type: 'POST',
        url: '/customize/ui/toggle/',
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
            showNotification(expandNotification, "Something went wrong...");
        }
    });

}

function sendFlatModeToggle() {
    let csrf_token = getCSRF();

    $.ajax({
        type: 'POST',
        url: '/customize/flat-ui/toggle/',
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
            showNotification(expandNotification, "Something went wrong...");
        }
    });

}

function yb_sendBitToggle(action) {
    let csrf_token = getCSRF();
    $.ajax({
        type: 'POST',
        url: '/customize/bit/toggle/',
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
            showNotification(expandNotification, "Something went wrong...");
        }
    });
}

function yb_omcBitToggle() {
    let csrf_token = getCSRF();
    $.ajax({
        type: 'POST',
        url: '/customize/only-my-colors/toggle/',
        headers: {
            'X-CSRFToken': csrf_token
        },
        success: function (response) {
            console.log(response);
        },
        error: function (response) {
            console.log(response);
            showNotification(expandNotification, "Something went wrong...");
        }
    });
}


function yb_getCustomValues(key){
    CUSTOM_VALUES.getAttribute("data-" + key);
}

function yb_setCustomValues(key, value){
    CUSTOM_VALUES.setAttribute("data-" + key, value);
}

//Function for swapping out stylesheets between custom and default
function yb_swapSheets(state, sheet_name) {
    if (state === "default") {
        let sheet = DEFAULT_STYLESHEET_INDEX[sheet_name];
        document.getElementById(sheet_name).setAttribute("href", sheet);
    } else if (state === "modded") {
        let sheet = MODDED_STYLESHEET_INDEX[sheet_name];
        document.getElementById(sheet_name).setAttribute("href", sheet);
    }
}

//Used for toggling customization on and off
function yb_changeUIState(state) {
    if (state === "default") {
        yb_swapSheets("default", "yb-stylesheet-core");
        yb_swapSheets("default", "yb-stylesheet-modifier");
        yb_swapSheets("default", "yb-stylesheet-button");
        // yb_swapSheets("default", "yb-stylesheet-container");
    } else if (state === "modded") {
        yb_swapSheets("modded", "yb-stylesheet-core");
        yb_swapSheets("modded", "yb-stylesheet-modifier");
        yb_swapSheets("modded", "yb-stylesheet-button");
        // yb_swapSheets("modded", "yb-stylesheet-container");
    }
}

//Function for changing the color of UI groups
function changeColor(property, value) {
    document.documentElement.style.setProperty(property, value);
    yb_setCustomValues(property, value);
}


//Function to change the wallpaper between profiles **NEEDS REFACTORING**
function yb_changeWallpaper(value, profile=false) {
    let wallpaper_enabled;
    let blur_setting;
    let brightness_setting;
    if (profile) {
        wallpaper_enabled = yb_getProfileData("wallpaper-on");
        blur_setting = yb_getProfileData("blur");
        brightness_setting = yb_getProfileData("brightness");
        console.log("Retrieving wallpaper data from profile");

        if (wallpaper_enabled == "True") {
            console.log(value);
            console.log("Wallpaper enabled " + wallpaper_enabled )
            BG_IMAGE_A.style.display = "block";
            BG_IMAGE_SOURCE_A.src = value;
            //Edit root variable
            document.documentElement.style.setProperty("--yb-wallpaper-blur", blur_setting + "px");
            document.documentElement.style.setProperty("--yb-wallpaper-brightness", brightness_setting + "%");
            CONTENT_CONTAINER_A.classList.remove("yb-bg-autoGray");
            CONTENT_CONTAINER_B.classList.remove("yb-bg-autoGray");
            CONTENT_CONTAINER_A.classList.add("yb-bg-transparent");
            CONTENT_CONTAINER_B.classList.add("yb-bg-transparent");
            
        } else {
            console.log("Wallpaper display " + wallpaper_enabled )
            BG_IMAGE_A.style.display = "none";
            CONTENT_CONTAINER_A.classList.remove("yb-bg-transparent");
            CONTENT_CONTAINER_B.classList.remove("yb-bg-transparent");
            CONTENT_CONTAINER_A.classList.add("yb-bg-autoGray");
            CONTENT_CONTAINER_B.classList.add("yb-bg-autoGray");
        }
        
    } else {
        console.log("Retrieving wallpaper data from base");
        wallpaper_enabled = CUSTOM_VALUES.getAttribute("data-wallpaper-on");
        blur_setting = CUSTOM_VALUES.getAttribute("data-wallpaper-blur");
        brightness_setting = CUSTOM_VALUES.getAttribute("data-wallpaper-brightness");

        if (wallpaper_enabled == "True") {
            console.log(value);
            console.log("Wallpaper enabled " + wallpaper_enabled )
            BG_IMAGE_A.style.display = "block";
            BG_IMAGE_SOURCE_A.src = value;
            //Edit root variable
            document.documentElement.style.setProperty("--yb-wallpaper-blur", blur_setting + "px");
            document.documentElement.style.setProperty("--yb-wallpaper-brightness", brightness_setting + "%");
            CONTENT_CONTAINER_A.classList.remove("yb-bg-autoGray");
            CONTENT_CONTAINER_B.classList.remove("yb-bg-autoGray");
            CONTENT_CONTAINER_A.classList.add("yb-bg-transparent");
            CONTENT_CONTAINER_B.classList.add("yb-bg-transparent");
            
        } else {
            console.log("Wallpaper display " + wallpaper_enabled )
            BG_IMAGE_A.style.display = "none";
            CONTENT_CONTAINER_A.classList.remove("yb-bg-transparent");
            CONTENT_CONTAINER_B.classList.remove("yb-bg-transparent");
            CONTENT_CONTAINER_A.classList.add("yb-bg-autoGray");
            CONTENT_CONTAINER_B.classList.add("yb-bg-autoGray");
        }
    }
    
}

//Function to show the wallpaper **NEEDS REFACTORING**
function yb_showWallpaper() {
    BG_IMAGE_A.style.display = "block";
}

//Function to load and show wallpaper
function yb_loadWallpaper(profile = false) {
    let wallpaper = yb_getWallpaper(profile);
    yb_changeWallpaper(wallpaper);
    yb_showWallpaper();
}

function yb_overrideBitColors(user_default = false, bit_colors = false) {
    if (user_default === true) {
        console.log("User default is true");
        for (let i = 0; i < bit_elements.length; i++) {
            /* 
                Function to change bit color to and from user default, app default, or mixed theme
            */
            yb_swapSheets("modded", "yb-stylesheet-bit");

            //Identify current bit element
            let this_bit = bit_elements[i];

            //Get the bit id
            let this_id = this_bit.getAttribute("data-bit-id");

            //Gather all of the bit elements
            let this_name = this_bit.querySelector(".bit-name");
            let this_username = this_bit.querySelector(".bit-username");
            let this_title = this_bit.querySelector(".yb-title-bit");
            let this_text = this_bit.querySelector(".yb-body-bit");

            this_bit.style.backgroundColor = BIT_CUSTOM["primary-color"];
            this_name.style.color = BIT_CUSTOM["title-color"];
            this_username.style.color = BIT_CUSTOM["text-color"];

            try {
                let these_buttons = this_bit.querySelectorAll(".yb-button-feedback");
                let these_icons = this_bit.querySelectorAll(".yb-icon-bit");
                
                for (icon in these_icons) {
                    if (icon.classList.contains("active")) {
                        icon.style.fill = BIT_CUSTOM["icon-color"];
                    }
                }

                //For each button if the button is active apply custom active color
                for (button in these_buttons) {
                    if (button.classList.contains("active")) {
                        button.style.backgroundColor = BIT_CUSTOM["button-color"];
                    }
                }
            } catch {
                console.log("No buttons found");
            }
            try {
                this_title.style.color = BIT_CUSTOM["title-color"];
            } catch {
                console.log("No title found");
            }
            try {
                this_text.style.color = BIT_CUSTOM["text-color"];
            } catch {
                console.log("No text found");
            }
            
        }
    } else {
        if (bit_colors === true) {
            for (let i = 0; i < bit_elements.length; i++) {
                /* 
                    Function to change bit color to and from user default, app default, or mixed theme
                */

                yb_swapSheets("modded", "yb-stylesheet-bit");

                //Identify current bit element
                let this_bit = bit_elements[i];


                //Get the bit id
                let this_id = this_bit.getAttribute("data-bit-id");

                //Gather all of the bit elements
                let this_name = this_bit.querySelector(".bit-name");
                let this_username = this_bit.querySelector(".bit-username");
                let this_title = this_bit.querySelector(".yb-title-bit");
                let this_text = this_bit.querySelector(".yb-body-bit");


                this_bit.style.backgroundColor = this_bit.getAttribute("data-primary-color");
                this_name.style.color = this_bit.getAttribute("data-title-color");
                this_username.style.color = this_bit.getAttribute("data-text-color");

                //For each bit icon if the icon is active apply custom active color
                try {
                    let these_buttons = this_bit.querySelectorAll(".yb-button-feedback");
                    let these_icons = this_bit.querySelectorAll(".yb-icon-bit");
                    
                    for (icon in these_icons) {
                        if (icon.classList.contains("active")) {
                            icon.style.fill = this_bit.getAttribute("data-icon-color");
                        }
                    }
    
                    //For each button if the button is active apply custom active color
                    for (button in these_buttons) {
                        if (button.classList.contains("active")) {
                            button.style.backgroundColor = this_bit.getAttribute("data-button-color");
                        }
                    }
                } catch {
                    console.log("No buttons found");
                }

                try {
                    this_title.style.color = this_bit.getAttribute("data-title-color");
                } catch {
                    console.log("No title found");
                }
                try {
                    this_text.style.color = this_bit.getAttribute("data-text-color");
                } catch {
                    console.log("No text found");
                }
                
            }
        } else {
            for (let i = 0; i < bit_elements.length; i++) {
                /* 
                    Function to change bit color to and from user default, app default, or mixed theme
                */

                yb_swapSheets("default", "yb-stylesheet-bit");
                //Identify current bit element
                let this_bit = bit_elements[i];

                //Get the bit id
                let this_id = this_bit.getAttribute("data-bit-id");

                //Gather all of the bit elements
                let this_name = this_bit.querySelector(".bit-name");
                let this_username = this_bit.querySelector(".bit-username");
                let this_title = this_bit.querySelector(".yb-title-bit");
                let this_text = this_bit.querySelector(".yb-body-bit");
                
                

                this_bit.style.backgroundColor = "";
                this_name.style.color = "";
                this_username.style.color = "";
                try {
                    this_title.style.color = "";
                } catch {
                    console.log("No title found");
                }

                try {
                    
                    this_text.style.color = "";
                } catch {
                    console.log("No text found");
                }
                try {
                    let these_buttons = this_bit.querySelectorAll(".yb-button-feedback");
                    let these_icons = this_bit.querySelectorAll(".yb-icon-bit");
                    these_buttons.style.backgroundColor = "";
                    these_icons.style.fill = "";
                } catch {
                    console.log("No buttons found");
                }
                

            }
        }
    }
    
}

function yb_toggleMyColors(toggle) {
    if (toggle === true) {
        for (let i = 0; i < bit_elements.length; i++) {
            yb_changeBitColor(true);
        }
    } else {
        
    }
}


//Function to retrieve wallpaper based on screen width
function yb_getWallpaper(id) {
    let type;

    if (SCREEN_WIDTH < 768) {
        type = "mobile";
    } else {
        type = "desktop";
    }

    $.ajax({
        type: 'GET',
        url: `/photo/api/wallpaper/${id}`,
        success: function(response) {
            console.log(response)
            let wallpaper = response.wallpaper;
            if (type === "desktop") {
                wallpaper = response.background_desktop_url;
            } else {
                wallpaper = response.background_mobile_url;
            }
            yb_changeWallpaper(wallpaper);
        },
        error: function(response) {
            console.log(response);
        }
    });
}


//Function for adapting UI customizations to current profile
function yb_setProfileUI() {
    for (let i = 0; i < custom_ui_index.length; i++) {
        let this_style = profile_custom_info.getAttribute(`data-${custom_ui_index[i]}`);

        changeColor(`--yb-${custom_ui_index[i]}`, this_style);
    }

    let this_wallpaper = yb_getProfileData("background");
    console.log("This wallpaper: " + this_wallpaper)
    
    yb_changeWallpaper(this_wallpaper, true);


}

//Function for reverting customization back to active user preferences
function yb_revertUIColor() {
    for (let i = 0; i < custom_ui_index.length; i++) {

        let this_data = CUSTOM_VALUES.getAttribute(`data-ui-${custom_ui_index[i]}`);
        
        changeColor('--yb-' + custom_ui_index[i], this_data);
    }
    //Check if user has flat mode toggled on
    if (CUSTOM_CONFIG["flat-mode-on"] == "False") {
        let this_wallpaper = CUSTOM_VALUES.getAttribute("data-wallpaper");
        yb_changeWallpaper(this_wallpaper, false);
 
    } 



}

/*

    //Add new functions for getting various colors on site when rendering new elements 
    
        yb_getPrimaryUIColor()
        yb_getSecondaryUIColor()
        yb_getTitleUIColor()
        yb_getTextUIColor()
        yb_getIconUIColor()
        yb_getButtonUIColor()
        yb_getButtonTextUIColor()

        yb_getPrimaryBitColor()
        yb_getSecondaryBitColor()
        yb_getTitleBitColor()
        yb_getTextBitColor()
        yb_getIconBitColor()
        yb_getButtonBitColor()
        yb_getButtonTextBitColor()
        
    * These new functions should first check if custom UI modes are on. 
    * If they are then use the custom UI colors, if not use the default colors
    * When using default colors, check if user has flat mode on or off 
    * Check if theme is light or dark mode
    * Return the appropriate color
    
    This new approach makes it easier to update UI colors and render new elements asynchronously
    while handling Yourbits wide variety of themes and color modes
*/

function yb_getPrimaryUIColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["custom-ui-on"] == "True") {
        //Return panel color
        return UI_CUSTOM["panel-color"];
    } else {
        //Check for light dark mode preference in browser
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            
            return "black";
        } else {
            return "white";
        }
        
    }
}

function yb_getSecondaryUIColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["custom-ui-on"] == "True") {
        //Return panel color
        return UI_CUSTOM["accent-color"];
    } else {
        //Check for light dark mode preference in browser
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "#333333";
        } else {
            return "#969696";
        }
        
    }
}

function yb_getTitleUIColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["custom-ui-on"] == "True") {
        //Return panel color
        return UI_CUSTOM["title-color"];
    } else {
        //Check for light dark mode preference in browser
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "white";
        } else {
            return "black";
        }
        
    }
}

function yb_getTextUIColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["custom-ui-on"] == "True") {
        //Return panel color
        return UI_CUSTOM["text-color"];
    } else {
        //Check for light dark mode preference in browser
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "white";
        } else {
            return "black";
        }
        
    }
}

function yb_getIconUIColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["custom-ui-on"] == "True") {
        //Return panel color
        return UI_CUSTOM["icon-color"];
    } else {
        //Check for light dark mode preference in browser
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "white";
        } else {
            return "black";
        }
        
    }
}

function yb_getButtonUIColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["custom-ui-on"] == "True") {
        //Return panel color
        return UI_CUSTOM["button-color"];
    } else {
        //Check for light dark mode preference in browser
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "#333333";
        } else {
            return "#969696";
        }
        
    }
}

function yb_getButtonTextUIColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["custom-ui-on"] == "True") {
        //Return panel color
        return UI_CUSTOM["button-text-color"];
    } else {
        //Check for light dark mode preference in browser
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "white";
        } else {
            return "black";
        }
        
    }
}

function yb_getPrimaryBitColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["bit-colors-on"] == "True") {
        //Return panel color
        return BIT_CUSTOM["primary-color"];
    } else {
        //Check if flat mode is on
        if (CUSTOM_CONFIG["flat-mode-on"] == "True") {
            return "transparent";
        } else {
            //Check for light dark mode preference in browser
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "#333333";
            } else {
                return "#969696";
            }
        }

    }
}

function yb_getSecondaryBitColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["bit-colors-on"] == "True") {
        //Return panel color
        return BIT_CUSTOM["secondary-color"];
    } else {
        //Check if flat mode is on
        if (CUSTOM_CONFIG["flat-mode-on"] == "True") {
            return "transparent";
        } else {
            //Check for light dark mode preference in browser
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "#333333";
            } else {
                return "#969696";
            }
        }

    }
}

function yb_getTitleBitColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["bit-colors-on"] == "True") {
        //Return panel color
        return BIT_CUSTOM["title-color"];
    } else {
        //Check if flat mode is on
        if (CUSTOM_CONFIG["flat-mode-on"] == "True") {
            return "transparent";
        } else {
            //Check for light dark mode preference in browser
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "#333333";
            } else {
                return "#969696";
            }
        }

    }
}
function yb_getTextBitColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["bit-colors-on"] == "True") {
        //Return panel color
        return BIT_CUSTOM["text-color"];
    } else {
        //Check if flat mode is on
        if (CUSTOM_CONFIG["flat-mode-on"] == "True") {
            return "transparent";
        } else {
            //Check for light dark mode preference in browser
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "#333333";
            } else {
                return "#969696";
            }
        }

    }
}

function yb_getIconBitColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["bit-colors-on"] == "True") {
        //Return panel color
        return BIT_CUSTOM["icon-color"];
    } else {
        //Check if flat mode is on
        if (CUSTOM_CONFIG["flat-mode-on"] == "True") {
            return "transparent";
        } else {
            //Check for light dark mode preference in browser
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "#333333";
            } else {
                return "#969696";
            }
        }

    }
}

function yb_getButtonBitColor() {
    //Check if UI customization is on
    if (CUSTOM_CONFIG["bit-colors-on"] == "True") {
        //Return panel color
        return BIT_CUSTOM["button-color"];
    } else {
        //Check if flat mode is on
        if (CUSTOM_CONFIG["flat-mode-on"] == "True") {
            return "transparent";
        } else {
            //Check for light dark mode preference in browser
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return "#333333";
            } else {
                return "#969696";
            }
        }

    }
}
