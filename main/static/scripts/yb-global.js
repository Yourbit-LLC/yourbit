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
    "feedback_listener": "/static/scripts/yb-feedback-listener.js/",
    "list_listener":"/static/scripts/yb-list-listener.js"

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
        bounding.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

function debounce(func, delay) {
    let timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, arguments);
      }, delay);
    }
  }


function yb_hideUI(){
    let screen_width = screen.width;
    if (screen_width < 600) {
        let divider = document.getElementById("cb-divider");
    
        $("#mobile-header").animate({"top":"-70px"});
        $("#nav").animate({"bottom": "-95px"});
        $("#mobile-search-button").animate({"right": "-100px"});
        $("#mobile-create-button").animate({"left":"-100px"});
        $("#back-to-home").hide();
        yb_setSessionValues("ui", "hidden")
        
        
        // $("#cb-divider").fadeIn();
        // $("#cb-divider").css({"background-color":"rgba(0, 0, 0, 0.7)"});
    }
}

function yb_hideSpaceBar() {
    if (screen.width < 600){
        $("#nav").animate({"bottom": "-85px"});
        $("#mobile-search-button").animate({"right": "-100px"});
        $("#mobile-create-button").animate({"left":"-100px"});
       
        yb_setSessionValues("ui", "hidden")
    }
}

function yb_createElement(type, yb_id, yb_class) {
    let new_element = document.createElement(type);
    new_element.setAttribute("id", yb_id);
    new_element.setAttribute("class", yb_class);

    return new_element;

}

function yb_renderImage(source, yb_class, yb_id) {
    let new_element = yb_createElement("img", yb_id, yb_class);
    new_element.setAttribute("src", source);
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


function yb_createButton(name, yb_id, yb_class, label) {
    let new_element = yb_createElement("button", yb_id, yb_class);

    new_element.setAttribute("name", name);

    new_element.innerHTML = label

    return new_element;

}

function yb_createInput(type, yb_class, yb_id, placeholder) {
    let new_element;
    
    if (type === "textarea"){
        new_element = yb_createElement("textarea", yb_id, yb_class);
    } 

    else {
        new_element = yb_createElement("input", yb_id, yb_class);
        new_element.setAttribute("type", type);
    }

    if (placeholder != "none"){
        new_element.setAttribute("placeholder", placeholder);
    }

    return new_element;
}

function yb_createLabel(yb_class, yb_id, label_for, text){
    let new_element = yb_createElement("label", yb_class, yb_id);
    new_element.setAttribute("for", label_for);
    new_element.innerHTML = text;
    return new_element;
}

function getBaseURL() {
    let base_url = window.location.origin;
    return base_url;
}



function post_fly_in(callback) {
    console.log('trigger post animation');
    $('#content-container').animate({'top':'0vh'}, 'fast');
    setTimeout(callback, 1000);
};


function headerDropIn(){
    $('#mobile-header').animate({"top":"0px"});
    
};

function yb_showSpaceBar() {
    let width = screen.width;
    if (width < 700) {
        $(".navigation-bar").animate({'bottom':'0'}, 'fast');
        $("#mobile-create-button").animate({'left':'8px'}, 'fast');
        $("#mobile-search-button").animate({'right':'8px'}, 'fast');
    } else {
        $(".navigation-bar").animate({'top':'0'}, 'fast');

    }

}
function initUI() {
    let width = screen.width;
    if (width < 700) {
        $(".navigation-bar").animate({'bottom':'0'}, 'slow');
        $("#mobile-create-button").animate({'left':'8px'}, 'slow');
        $("#mobile-search-button").animate({'right':'8px'}, 'slow');

        let tasks = yb_getRunningTasks();

        yb_setSessionValues("ui", "visible");
    } else {
        $(".navigation-bar").animate({'top':'0'}, 'slow');

    }
    $('#main-splash-text').animate({'bottom': '0'}, 200);
    $('#main-splash-image').animate({'top':'0px'},200);
    $("#menu-task").animate({'height':'0px', 'width':'0px'}, 200);
    $("#menu-task").hide();

    let tasks = yb_getRunningTasks();

    yb_setSessionValues("ui", "visible");
    if (tasks.length > 0) {
        yb_showMiniBar();
    } else {
        $(".minibar").hide();
    }
    

}

function hideContextMenu(type, this_element){
    
    let target_element_name = this_element.getAttribute("data-bit-id");
    let this_id = this_element.getAttribute("data-id");
    console.log(this_id)
    let target_element = document.getElementById(target_element_name);
    let context_menu = document.getElementById(`bit-context-${this_id}`);
    let exit_menu = document.getElementById(`context-menu-exit`);
    let divider = document.getElementById(`context-backdrop-${this_id}`);
    context_menu.remove();
    exit_menu.remove();
    divider.remove();
    if (type === "close"){
        target_element.style.zIndex = "1";
    }
}

function yb_handleEditBit(this_element) {
    let form = document.getElementById('mobile-create-inputs');
    let type_field = document.getElementById('bit-type-hidden-field');
    let option_field = document.getElementById('create-option-hidden-field');
    let script_source = document.getElementById('create-script');
    let header_text = document.getElementById("create-bit-header-text");
    let this_id = this_element.getAttribute("data-id");
    let container = document.getElementById("create-container");
    

    
    
    showCreateBit(raiseCreateBit);

    yb_chatBitForm(form, type_field, option_field, script_source);

    let hidden_field = yb_createInput("hidden", "none", "bit-id-hidden-field", "none");
    hidden_field.setAttribute("value", this_id);
    form.appendChild(hidden_field);

    let publish_button = document.getElementById("mobile-publish-bit");
    publish_button.setAttribute("name", "update");
    header_text.innerHTML = "Edit Bit";
    header_text.style.marginLeft = "10px";
    header_text.style.marginTop = "6px";

    $("#back-create").replaceWith('<svg id="back-create" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5 23.7q-.825 0-1.413-.588Q3 22.525 3 21.7v-14q0-.825.587-1.413Q4.175 5.7 5 5.7h8.925l-2 2H5v14h14v-6.95l2-2v8.95q0 .825-.587 1.412-.588.588-1.413.588Zm7-9Zm4.175-8.425 1.425 1.4-6.6 6.6V15.7h1.4l6.625-6.625 1.425 1.4-7.2 7.225H9v-4.25Zm4.275 4.2-4.275-4.2 2.5-2.5q.6-.6 1.438-.6.837 0 1.412.6l1.4 1.425q.575.575.575 1.4T22.925 8Z"/></svg>');
    yb_fillBitForm(this_id);


};

function removeMessage() {
    $(".feed-message-bit-removed").remove();
}

function animateAwayFeedMessage() {
    $(".feed-message-bit-removed").animate({"height":"0px", "width": "0px"});
    $(".feed-message-bit-removed").fadeOut();
    
    setTimeout(removeMessage, 500)

}


function yb_handleHideBit(bit_id) {
    $(`#bit-${bit_id}`).fadeOut();
    $(`#bit-${bit_id}`).replaceWith(
        `
            <div style="overflow:hidden;" class='feed-message-bit-removed'>
                <h2>Bit Hidden</h2>
            </div>
            
        `
    );
    setTimeout(animateAwayFeedMessage, 2000)
}

function yb_recolorText(parentElement) {
    const computedStyle = window.getComputedStyle(parentElement);
    const backgroundColor = computedStyle.backgroundColor;
    const grayscaleColor = rgbToGrayscale(backgroundColor);
  
    const textColor = computedStyle.color;
    const oppositeGrayscaleColor = rgbToGrayscale(textColor) === 0 ? 255 : 0;
  
    const newTextColor = `rgb(${oppositeGrayscaleColor}, ${oppositeGrayscaleColor}, ${oppositeGrayscaleColor})`;
    parentElement.style.color = newTextColor;
  }
  
  function yb_rgbToGrayscale(rgbColor) {
    const colorValues = rgbColor.replace(/[^\d,]/g, '').split(',');
    const red = parseInt(colorValues[0]);
    const green = parseInt(colorValues[1]);
    const blue = parseInt(colorValues[2]);
    const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;
    return grayscale;
  }
  