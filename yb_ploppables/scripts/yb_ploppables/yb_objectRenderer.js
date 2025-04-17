function yb_positionObject (object, x, y) {
    if (object) {
        object.style.left = x + "px";
        object.style.top = y + "px";
    } else {
        console.error("Object is null or undefined.");
    }
}

function yb_setObjectSize (object, width, height) {
    if (object) {
        object.style.width = width + "px";
        object.style.height = height + "px";
    } else {
        console.error("Object is null or undefined.");
    }
}
function yb_setObjectVisibility (object, isVisible) {
    if (object) {
        object.style.display = isVisible ? "block" : "none";
    } else {
        console.error("Object is null or undefined.");
    }
}
function yb_setObjectOpacity (object, opacity) {
    if (object) {
        object.style.opacity = opacity;
    } else {
        console.error("Object is null or undefined.");
    }
}
function yb_setObjectBackgroundColor (object, color) {
    if (object) {
        object.style.backgroundColor = color;
    } else {
        console.error("Object is null or undefined.");
    }
}
function yb_setObjectBorder (object, border) {
    if (object) {
        object.style.border = border;
    } else {
        console.error("Object is null or undefined.");
    }
}
function yb_setZIndex (object, zIndex) {
    if (object) {
        object.style.zIndex = zIndex;
    } else {
        console.error("Object is null or undefined.");
    }
}