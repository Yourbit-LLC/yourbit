try {
    var search_input = document.getElementById("sticker-search-input");
    var sticker_container = document.getElementById("sticker-list-container");
} catch (e) {
    search_input = document.getElementById("sticker-search-input");
    sticker_container = document.getElementById("sticker-list-container");
}

function yb_searchStickers(search_term) {
    $(sticker_container).empty();
    $(sticker_container).load(`/customize/stickers/search/${search_term}`);
};

$(document).ready(function() {
    //search when user presses enter in search input

    
    $(search_input).on("change keyup", function(e) {
        if (e.key === "Enter") {
            yb_searchStickers(this.value);
        }
    });
});