/*
    Get CSRF function for use in making requests
*/

var yb_scripts = {
    "home" : "/static/scripts/yb-home.js/",
    "profile": "/static/scripts/yb-profiles.js/",
    "search": "/static/scripts/yb-search.js/",
    "customize": "/static/scripts/yb-customize.js",
    "connections": "/static/scripts/yb-connections.js",
    "settings": "/static/scripts/yb-settings.js",
    "messages": "/static/scripts/yb-messages.js",
    "rewards": "/static/scripts/yb-rewards.js/",
    "interact": "/static/scripts/yb-interact.js/",
    "feedback-listener": "/static/scripts/yb-feedback-listener.js/"

}

function getCSRF() {
    let cookie = document.cookie;
    let csrf = document.getElementById('csrf-token').value;
    return csrf
}

var isInViewport = function (elem) {
    let this_element = elem.slice(1);
    let element = document.getElementById(this_element);
    let bounding = element.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

function yb_createElement(type, yb_id, yb_class) {
    let new_element = document.createElement(type);
    new_element.setAttribute("id", yb_id);
    new_element.setAttribute("class", yb_class);

    return new_element;

}

function yb_createScript(source){
    console.log("ran create script");
    let current = document.getElementById("page-script");

    let script_source = yb_scripts[source];
    let new_script = document.createElement("script");
    
    new_script.setAttribute("id", "page-script");
    new_script.setAttribute("src", script_source);

    return new_script;
}


function yb_createButton(name, yb_id, yb_class) {
    let new_element = document.createElement("button");
    new_element.setAttribute("id", yb_id);
    new_element.setAttribute("class", yb_class);
    new_element.setAttribute("name", name)

    return new_element;

}

function getBaseURL() {
    let base_url = window.location.origin;
    return base_url;
}



function post_fly_in() {
    console.log('trigger post animation');
    $('#content-container').animate({'top':'1vh'}, 'fast');

};


function headerDropIn(){
    $('#mobile-header').animate({"top":"0px"});
    setTimeout(initUI, 100)
};

function initUI() {
    $(".navigation-bar").animate({'bottom':'0'}, 'slow');
    $("#mobile-create-button").animate({'left':'8px'}, 'slow');
    $("#mobile-search-button").animate({'right':'8px'}, 'slow');
    $('#main-splash-text').animate({'bottom': '0'}, 200);
    $('#main-splash-image').animate({'top':'0px'},200);
    let tasks = getRunningTasks();

    if (tasks.length > 0) {
        setTimeout(showMiniBar, 1200);
    } 
    

}