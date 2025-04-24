try {
    var feed_filter_btns = document.querySelectorAll(".ff-button");
    var stickyElement = document.getElementById('yb-browse-nav');
    var sort_btn = document.getElementById("ff-button-sort");
    var filter_by = document.getElementById("ff-button-filter");
    var feed_refresh = document.getElementById("ff-button-refresh");
    var customization = document.getElementById("ff-button-customize");
    var filter_panel = document.getElementById("yb-panel-filter");
    var filter_panels= document.querySelectorAll(".yb-filter-panel");
}

catch {
    stickyElement = document.getElementById('yb-browse-nav');
    feed_filter_btns = document.querySelectorAll(".ff-button");
    sort_btn = document.getElementById("ff-button-sort");
    filter_by = document.getElementById("ff-button-filter");
    customization = document.getElementById("ff-button-customize");
    feed_refresh = document.getElementById("ff-button-refresh");
    filter_panel = document.getElementById("yb-panel-filter");
    filter_panels= document.querySelectorAll(".yb-filter-panel");
}



function yb_getFilterPanel(template) {
    $(filter_panel).load(template);

}

function yb_closeFilterPanel() {
    for (var i = 0; i < filter_panels.length; i++) {
        if (filter_panels[i].classList.contains("active")) {
            filter_panels[i].classList.remove("active");
        }
    }
    for (var i = 0; i < feed_filter_btns.length; i++) {
        if (feed_filter_btns[i].classList.contains("active")) {
            feed_filter_btns[i].classList.remove("active");
        }
    }
}

function yb_filterPanelHandler() {

    var filter_panel_type = this.getAttribute("data-type");
    if (filter_panel_type == "refresh") {
        yb_getFeed();
    } else{
        let this_panel = document.getElementById(`yb-${filter_panel_type}-panel`);
        if (this.classList.contains("active")) {
            yb_closeFilterPanel();
        } else {
            for (var i = 0; i < feed_filter_btns.length; i++) {
                if (feed_filter_btns[i].classList.contains("active")) {
                    feed_filter_btns[i].classList.remove("active");
                }
            }
        }
        this.classList.add("active");
        for (var i = 0; i < filter_panels.length; i++) {
            if (filter_panels[i].classList.contains("active")) {
                filter_panels[i].classList.remove("active");
            }
        }
        this_panel.classList.add("active");
        
    }
}


feed_filter_btns.forEach(btn => {
    btn.addEventListener("click", yb_filterPanelHandler);

});

feed_refresh.addEventListener("click", function() {
    let data = {
        "update": false,
        "page": 1,
    }
    yb_getBitContainer().innerHTML = "";
    yb_getFeed(data);
});



function throttle(callback, delay) {
    let lastTime = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastTime >= delay) {
        callback(...args);
        lastTime = now;
      }
    };
  }
  
 
$(document).ready(function() {
    // Observe the sticky element
    document.addEventListener(
        'scroll',
        throttle(() => {
          const topPosition = stickyElement.getBoundingClientRect().top;
          if (topPosition <= 0) {
            stickyElement.classList.add('fixed');
          } else {
            stickyElement.classList.remove('fixed');
          }
        }, 100) // Adjust delay as needed
      );
}
);