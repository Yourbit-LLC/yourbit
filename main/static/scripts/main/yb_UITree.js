const YB_ICON_INDEX = {
    //Space Buttons
    "space-buttons": document.querySelectorAll(".space-button"),
    "space-button-global": document.getElementById("global-space-button"),
    "space-button-chat": document.getElementById("chat-space-button"),
    "space-button-photo": document.getElementById("photo-space-button"),
    "space-button-video": document.getElementById("video-space-button"),
}

const YB_BUTTON_INDEX = {
    "button-create-menu": document.getElementById("yb-create-menu-button"),

}

const YB_CONTAINER_INDEX = {
    "slide-up-core": document.getElementById("yb-slide-up-core"),
    "create_menu": document.getElementById("yb-create-menu"),
}


const YB_UI_INDEX = {
    //Space Buttons
    "icons": YB_ICON_INDEX,

    //Search Bar
    "search-field-desktop": { 
        "element": document.getElementById("search-field-desktop"),
        "click": "clickFunction()",
        "change": "changeFunction()",
        "focus": "focusFunction()",
        "blur": "blurFunction()",
    },

    "search-button": {
        "element": document.getElementById("search-button"),
        "click": "clickFunction()",
        "change": "changeFunction()",
        "focus": "focusFunction()",
        "blur": "blurFunction()",
    },

    "search-icon": document.getElementById("search-icon"),
    "search-container": document.getElementById("search-container"),
}

function yb_queryUI(key, subkey=null) {
    //if key contains space replace with hyphen and ensure all lower
    key = key.replace(" ", "-").toLowerCase();

    if (subkey) {
        return YB_UI_INDEX[key][subkey];
    }
    return YB_UI_INDEX[key];
}

