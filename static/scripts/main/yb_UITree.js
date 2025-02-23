const YB_ICON_INDEX = {
    //Space Buttons
    "all-icons": document.querySelectorAll(".yb-icon"),
    "space-buttons": document.querySelectorAll(".space-button"),
    "space-button-global": document.getElementById("global-space-button"),
    "space-button-chat": document.getElementById("chat-space-button"),
    "space-button-photo": document.getElementById("photo-space-button"),
    "space-button-video": document.getElementById("video-space-button"),
}

const YB_BUTTON_INDEX = {
    "button-create-menu": {
        "element" : document.getElementById("yb-create-menu-button"),
        "click": "clickFunction()",
    },
    "button-inbox-desktop": {
        "element": document.getElementById("inbox-button-desktop"),
        "click": "clickFunction()",
    },
    "button-inbox-mobile": {
        "element": document.getElementById("inbox-button-mobile"),
        "click": "clickFunction()",
    },
    "button-submit-search": {
        "element": document.getElementById("search-button"),
        "click": "clickFunction()",
    },
    "button-popout-create": {
        "element": document.getElementById("popout-create-button"),
        "click": "clickFunction()",
    },
    "button-popout-search": {
        "element": document.getElementById("popout-search-button"),
        "click": "clickFunction()",
    },

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

function yb_queryElement(key) {
    //if key contains space replace with hyphen and ensure all lower
    key = key.replace(" ", "-").toLowerCase();

    let results = null;

    for (let index in YB_UI_INDEX) {
        if (index[key]) {
            return index[key]["element"];
        }
    }

    return results;
}

function yb_queryUI(key, subkey) {
    let results = null;

    for (let index in YB_UI_INDEX) {
        for (let subindex in index)
            if (subindex == key) {
                return subindex[subkey];
            }
    }

    return results;

}

function yb_getUIGroup(key) {
    let results = null;

    for (let index in YB_UI_INDEX) {
        if (index === key) {
            return index;
        }
    }

    return results;
}

