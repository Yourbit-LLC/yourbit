try {
    var feed_filter_btns = document.querySelectorAll(".ff-button");
    var sort_btn = document.getElementById("ff-button-sort");
    var filter_by = document.getElementById("ff-button-filter");
    var feed_refresh = document.getElementById("ff-button-refresh");
    var customization = document.getElementById("ff-button-customize");
    var filter_panel = document.getElementById("yb-panel-filter");
    var filter_panel_index = {
        "sort": {
            "template": "/bits/templates/filter/sort/",
        },
        "filter": {
            "template": "/bits/templates/filter/filter/",
        },
        "customize": {
            "template": "/bits/templates/filter/customize/",
        },
    }
}

catch {
    feed_filter_btns = document.querySelectorAll(".ff-button");
    sort_btn = document.getElementById("ff-button-sort");
    filter_by = document.getElementById("ff-button-filter");
    customization = document.getElementById("ff-button-customize");
    feed_refresh = document.getElementById("ff-button-refresh");
    filter_panel = document.getElementById("yb-panel-filter");
    filter_panel_index = {
        "sort": {
            "template": "/bitstream/sort-panel/",
        },
        "filter": {
            "template": "/bitstream/filter-panel/",
        },
        "customize": {
            "template": "/bitstream/customize-panel/",
        },
    }
}



function yb_getFilterPanel(template) {
    fetch(template)
        .then(response => response.text())
        .then(data => {
            filter_panel.innerHTML = data;
        });
}

function yb_closeFilterPanel() {
    filter_panel.innerHTML = "";
    for (var i = 0; i < feed_filter_btns.length; i++) {
        if (feed_filter_btns[i].classList.contains("active")) {
            feed_filter_btns[i].classList.remove("active");
        }
    }
}

function yb_filterPanelHandler() {
    var filter_panel_type = this.getAttribute("data-type");
    var template = filter_panel_index[filter_panel_type]["template"];
    if (this.classList.contains("active")) {
        yb_closeFilterPanel();
    } else {
        for (var i = 0; i < feed_filter_btns.length; i++) {
            if (feed_filter_btns[i].classList.contains("active")) {
                feed_filter_btns[i].classList.remove("active");
            }
        }
        this.classList.add("active");
    }
    yb_getFilterPanel(template);
}

feed_filter_btns.forEach(btn => {
    btn.addEventListener("click", yb_filterPanelHandler);

});

feed_refresh.addEventListener("click", function() {
    yb_startBitstream();
});

