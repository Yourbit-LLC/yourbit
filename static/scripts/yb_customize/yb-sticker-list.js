try {
    var available_stickers = document.querySelectorAll(".sticker-thumbnail");
} catch (e) {
    available_stickers = document.querySelectorAll("sticker-thumbnail");
}

$(document).ready(function() {
    for (let i = 0; i < available_stickers.length; i++) {
        yb_createDragonInstance(available_stickers[i]);
    }
});