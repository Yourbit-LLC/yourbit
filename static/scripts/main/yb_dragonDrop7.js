/*
    yb_dragonDrop.js
    Yourbit, LLC, 2023
    Author: Austin Chaney
    Created: 6/31/2024

/*

    Data Structure for Dragon Object Instances
    "instance-id": {
        "startX": 0,
        "startY": 0,
        "offsetX": 0,
        "offsetY": 0,
        "width": 0,
        "height": 0,
        "rotation": 0,
        "scale": 1,
    }

    The instance-id will be used to query the object in the dragon_objects object

*/

var first_move = true;
var dragon_objects = {}; //List of available Dragon Objects
var dragon_instances = {}; //List of cloned Dragon Object Instances
var dragon_target;
var clone_count = 0;
var isTouch = false;

function duplicateObject(object) {
    let new_object = object.cloneNode(true);
    return new_object;
}

function reparentObject(object, new_parent) {
    new_parent.appendChild(object);
}

function getDistance(touch1, touch2) {
    return Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
}

function getAngle(touch1, touch2) {
    return Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX) * (180 / Math.PI);
}

function yb_clearDragonObjects() {
    dragon_objects = {};
};

function yb_dragonMouseMove(event) {
    let target = dragon_target;
    let target_id = target.getAttribute("data-catid");
    let data = dragon_instances[target_id];


    let newX = data.startX - event.clientX;
    let newY = data.startY - event.clientY;

    data.startX = event.clientX;
    data.startY = event.clientY;

    target.style.left = (target.offsetLeft - newX) + "px";
    target.style.top = (target.offsetTop - newY) + "px";
}

function yb_dragonTouchMove(event) {


    let target = dragon_target;
    let target_id = target.getAttribute("data-catid");
    let data = dragon_instances[target_id];


    let newX = data.startX - event.clientX;
    let newY = data.startY - event.clientY;

    data.startX = event.clientX;
    data.startY = event.clientY;

    target.style.left = (target.offsetLeft - newX) + "px";
    target.style.top = (target.offsetTop - newY) + "px";

}

//Function to create a new instance of a dragon object
function yb_createDragonInstance(dragon_instance, clone=false) {

    console.log("Creating dragon instance")
    let instance_id;

    if (clone) {
        instance_id = dragon_instance.id;

        dragon_instances[instance_id] = {
            "startX": dragon_instance.offsetLeft,
            "startY": dragon_instance.offsetTop,
            "newX": 0,
            "newY": 0,
            "rotation": dragon_instance.style.transform,
            "scale": dragon_instance.style.transform,

        }
    } else {
        instance_id = dragon_instance.getAttribute("data-catid");

        dragon_objects[instance_id] = {
            "startX": 0,
            "startY": 0,
            "newX": 0,
            "newY": 0,
            "rotation": 0,
            "scale": 1,

        }
    
    }


    if (!clone) {
        dragon_instance.addEventListener("mousedown", yb_dragonDrop);
    } else {
        dragon_instance.addEventListener("mousedown", function(event) {yb_dragonDrop(event, true)});
    }
}

function yb_deleteDragonInstance(instance_id) {

    delete dragon_instances[instance_id];
}

function yb_deleteSticker(event) {
    event.preventDefault();
    let target = event.currentTarget;

    yb_deleteDragonInstance(target.id);
    target.remove();
}
    
function yb_dragonMouseUp(event) {
    
    document.removeEventListener("mousemove", yb_dragonMouseMove);
    //right click to delete
    dragon_target.addEventListener("contextmenu", yb_deleteSticker);
    document.removeEventListener("mouseup", yb_dragonMouseUp);
}

function yb_dragonTouchEnd(event) {
    document.removeEventListener("mousemove", yb_dragonMouseMove);
    //right click to delete
    dragon_target.addEventListener("contextmenu", yb_deleteSticker);
    document.removeEventListener("mouseup", yb_dragonMouseUp);

}


function yb_dragonDrop(event, clone=false) {
    console.log("running dragon drop")
    event.preventDefault();
    let target = event.currentTarget;
    let target_id;
    let data;

    if (device.toLowerCase() === "mobile") {
        isTouch = true;
    } else {
        isTouch = false;
    }

    if (!clone) {
        target_id = target.getAttribute("data-catid");
        console.log(target_id)
        data = dragon_objects[target_id];
        console.log(data)
    } else {
        target_id = target.id;
        data = dragon_instances[target_id];
    }
    //Set the initial position of the object
    data.startX = event.clientX;
    data.startY = event.clientY;

    if (!clone || event.shiftKey) {
        clone = target.cloneNode(true);
        clone.style.position = "fixed";
        clone.style.zIndex = "1000";
        CONTENT_CONTAINER_B.appendChild(clone);

        // Set the initial position of the clone
        if (isTouch) {
            console.log("touch")
            clone.style.left = event.clientX + "px";
            clone.style.top = event.clientY + "px";
        } else {
            console.log("mouse")
            clone.style.left = event.clientX + "px";
            clone.style.top = event.clientY + "px";
        }

        clone.style.transform = "translate(-50%, -50%)"; // Center the clone
        clone_count += 1;
        clone.id = `dragon-clone-${clone_count}`;
        clone.setAttribute("data-catid", clone.id);
        console.log(clone.id)
        console.log(clone.getAttribute("data-catid"))
        clone.setAttribute("draggable", "true");
        dragon_target = clone;
        yb_createDragonInstance(dragon_target, true);

        console.log(dragon_instances)
        console.log(dragon_target);

        if (event.shiftKey) {
            target.remove();
        }
    } else {
        //check if shift key is down
        target.style.left = event.clientX + "px";
        target.style.top = event.clientY + "px";
        target.style.transform = "translate(-50%, -50%)"; // Center the clone

        dragon_target = target;
    }
 
    if (isTouch) {
        document.addEventListener("touchmove", yb_dragonTouchMove);
        document.addEventListener("touchend", yb_dragonTouchEnd);
    } else {
        document.addEventListener("dragstart", yb_dragonMouseMove);
        document.addEventListener("mouseup", yb_dragonMouseUp);
    }

    if (event.touches && event.touches.length === 2) {
        initialDistance = getDistance(event.touches[0], event.touches[1]);
        initialAngle = getAngle(event.touches[0], event.touches[1]);
    }

    yb_closeDrawer();
    
    
}

// Prevent context menu from appearing on touch devices
document.addEventListener('contextmenu', function (event) {
    if (event.touches) {
        event.preventDefault();
    }
}, false);

// Prevent click event from firing after touchstart
document.addEventListener('click', function (event) {
    if (isTouch) {
        event.preventDefault();
        // isTouch = false;
    }
}, true);

