var plopping_objects = [];
var objects_to_plop = [];

function yb_recordInstancePosition(object, position) {
    if (!object || !position) return;
    var objectData = {
        object: object,
        position: position
    };
    objects_to_plop.push(objectData);
}

function yb_createObjectInstance(object, position) {
    if (!object || !position) return;
    var newObject = object.cloneNode(true);
    newObject.style.position = "absolute";
    newObject.style.left = position.x + "px";
    newObject.style.top = position.y + "px";
    document.body.appendChild(newObject);
    plopped_objects.push(newObject);
}

function getPloppedObjects() {
    return plopped_objects;
}