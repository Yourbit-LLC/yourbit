/*
    yb_containers.js
    Yourbit, LLC, 2024
    Author: Austin Chaney
    Created: 7/11/2024
*/


//Core Content
const CONTENT_CONTAINERS = document.querySelectorAll(".content-container");
const CONTENT_CONTAINER_A = document.getElementById('content-container-a'); //yb_goToPage(template, data=null)
const CONTENT_CONTAINER_B = document.getElementById('content-container-b'); //yb_goToPage(template, data=null)


//2 Way Containers
const SIDE_CONTAINER_A = document.getElementById("yb-dynamic-2way-a");
const SIDE_CONTAINER_B = document.getElementById("yb-dynamic-2way-b");
const SIDE_CONTAINERS = document.querySelectorAll(".yb-2Way-container"); //yb_toggle2WayContainer(type, scroll=false)

//Prompts
const PROMPT_CONTAINER = document.getElementById("prompt-container"); //yb_showPrompt(title, message, actions)
const PROMPT_TITLE = document.getElementById("prompt-content-a");
const PROMPT_BODY = document.getElementById("prompt-content-b");
const PROMPT_FOOTER = document.getElementById("prompt-content-c");

//Drawers
const DRAWER = document.getElementById("core-drawer-container"); //yb_openDrawer(template, id=null)
const DRAWER_INNER = document.getElementById("drawer-content");

const SLIDE_UP_CORE = document.getElementById("yb-slide-up-core"); //yb_showSlideUp(title, message, actions)

//Content Focus Container
const FOCUS_CONTAINER = document.getElementById("core-focus-container");
const DRAWER_FOCUS_CONTAINER = document.getElementById("yb-drawer-focus-container");

const CARD_CONTAINER = document.getElementById("yb-card");

const PHOTO_VIEWER = document.getElementById("photo-viewer");



function yb_openDrawer(template, id=null, reloadable=true) {
    if (!DRAWER.classList.contains("open")) {
        DRAWER.classList.add("open");
        yb_hideMobileNavigation();
    }
    console.log(template)
    if (reloadable == false) {
        DRAWER_CONTENT[template] = DRAWER_CONTENT[template].split("?")[0];
    }
    if (template != DRAWER.getAttribute("data-state")) {
        DRAWER_INNER.innerHTML = "";
        console.log(DRAWER_CONTENT[template]);
        if (id) {
            $(DRAWER_INNER).load(DRAWER_CONTENT[template].replace("{{data}}", data.toString()));
        } else {
            
            $(DRAWER_INNER).load(DRAWER_CONTENT[template]);
        }
        DRAWER.setAttribute("data-state", template);


    } else {
        if (reloadable == false){
            DRAWER_INNER.innerHTML = "";
            if (id) {
                $(DRAWER_INNER).load(DRAWER_CONTENT[template] + id.toString() + "/");
            } else {
                
                $(DRAWER_INNER).load(DRAWER_CONTENT[template]);
            }
        }
    }
    
}

function yb_closeDrawer() {
    DRAWER.classList.remove("open"); 
    if (yb_getSessionValues('fullscreen') == "false"){
        yb_showMobileNavigation();   
    }
}


/*
    --2 Way Container Functions--
    
*/

function yb_updateActiveTab(class_name, this_tab) {
    let tabs = document.getElementsByClassName(class_name);
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    
    this_tab.classList.add("active");
}

//Navigate to a 2 Way Page registered in the TWO_WAY_INDEX (yb_systems/routes.js)
function yb_2WayPage(index, page="", data=null) {
    let this_container;
    for (let i = 0; i < SIDE_CONTAINERS.length; i++) {
        if (SIDE_CONTAINERS[i].classList.contains("open")) {
            this_container = SIDE_CONTAINERS[i];
            break;
        }
    }

    

    let content = this_container.querySelector(".yb-2Way-content");
    let secondary = this_container.querySelector(".yb-2Way-secondary");
    let tetriary = this_container.querySelector(".yb-2Way-tetriary");

    if (index == 1) {
        secondary.classList.remove("active");
        tetriary.classList.remove("active");
        content.classList.remove("inactive");
        secondary.innerHTML = "";
        tetriary.innerHTML = "";

    } else if (index == 2) {
        
        secondary.classList.add("active");
        tetriary.classList.remove("active");
        content.classList.add("inactive");
        if (page != ""){
            history.pushState({container:"2way-page", template:page, data:data}, page, TWO_WAY_INDEX[page].url);
            if (data) {
                $(secondary).load(TWO_WAY_INDEX[page].template.replace("{{data}}", data.toString()));
            } else {
                $(secondary).load(TWO_WAY_INDEX[page].template);
            }
        }

    } else {
        history.pushState({container:"2way-page", template:page, data:data}, page, TWO_WAY_INDEX[page].url);
        tetriary.classList.add("active");
        content.classList.add("inactive");
        secondary.classList.remove("active");

        if (data) {
            $(tetriary).load(TWO_WAY_INDEX[page].replace("{{data}}", data.toString()));
        } else {
            $(tetriary).load(TWO_WAY_INDEX[page].template);
        }
    }

}

//Universal function to resize 2 Way Containers
function yb_resize2Way(size=1) {
    let container = document.getElementById("yb-dynamic-2way-a");
    if (size === 1) {
        container.classList.remove("expanded");
        container.classList.remove("expanded2");
    } else if (size === 2){
        container.classList.add("expanded");
    } else if (size === 3){
        container.classList.add("expanded2");
    }

}

function yb_dropDownMenu(menu_id) {
    let this_menu = document.getElementById(menu_id);
    this_menu.classList.toggle("open");
}

function yb_showMenuDivider(){
    let menu_divider = document.getElementById("menu-divider");
    menu_divider.classList.toggle("show");
}

function yb_filterScroll() {
        
    let scrollContainer = document.querySelector('.yb-hScroll');

    scrollContainer.addEventListener('wheel', (event) => {
        event.preventDefault(); // Prevent the default vertical scroll behavior
        scrollContainer.scrollLeft += event.deltaY; // Adjust the horizontal scroll position
    });
}

//Legacy Expand 2 Way **MARKED FOR REMOVAL**
function yb_expand2Way() {
    for (let i = 0; i < SIDE_CONTAINERS.length; i++) {
        if (SIDE_CONTAINERS[i].classList.contains("open")) {
            SIDE_CONTAINERS[i].classList.add("expanded");
            break;
        }
    }
}

//Legacy Collapse 2 Way **MARKED FOR REMOVAL**
function yb_collapse2Way() {
    for (let i = 0; i < SIDE_CONTAINERS.length; i++) {
        if (SIDE_CONTAINERS[i].classList.contains("open")) {
            SIDE_CONTAINERS[i].classList.remove("expanded");
            SIDE_CONTAINERS[i].classList.remove("expanded2");
            break;
        }
    }
}

//Clear content on the second page of a 2 way container
function yb_clearSecondaryContent() {
    for (let i = 0; i < SIDE_CONTAINERS.length; i++) {
        if (SIDE_CONTAINERS[i].classList.contains("open")) {
            let secondary = SIDE_CONTAINERS[i].querySelector(".yb-2Way-secondary");
            secondary.innerHTML = "";
            break;
        }
    }
}

//Clear content from the 2 way container entirely
function yb_clear2WayContainer(container){
    let page_scripts = container.querySelectorAll(".page-script");
    for (i = 0; i < page_scripts.length; i++){
        page_scripts[i].remove()
    }
    
    let container_content = container.querySelector(".yb-2Way-content");
    container_content.innerHTML = "";

    let secondary_content = container.querySelector(".yb-2Way-secondary");
    secondary_content.innerHTML = "";

}

//Hide the loading screen within a 2 way container
function yb_hide2WayLoad() {
    $(".yb-load-iconContainer").addClass("hide");

}

//Show loading screen within 2 way container
function yb_show2WayLoad() {
    $(".yb-load-iconContainer").removeClass("hide");
}

/*
    --2 Way Container Navigation--
    The following functions are used to navigate between 2 way containers

    This container is called the 2Way container because it slides in from the side on desktop,
    while on mobile it slides up from the bottom and takes the full screen

    How to use the 2 way container navigation functions:
        
        -To launch a new 2Way Container use the following function:
            yb_launch2WayContainer(page, data)
                -page: The key of the page in the TWO_WAY_INDEX
                -data: The data to be passed to the page (optional)
            
                This function will automatically switch containers if one is already active

        -To close the current 2Way Container use the following function:
            yb_toggle2WayContainer(type)
                -type: The type of the container to be closed, matches the key in the TWO_WAY_INDEX

            -or-

            yb_launch2WayContainer(page) will also close the current container if it is open

        When adding content that loads within a 2 Way container, always ensure to update the directory
        in the TWO_WAY_INDEX in the yb_systems/routes.js file
    
*/

//This is the base function for toggling 2 way containers
function yb_toggle2WayContainer(type, scroll=false){

    console.log(scroll)

    //In case of container expansion begin with collapsing
    
    yb_collapse2Way();

    //Check if main menu is open, if so, close it
    console.log(USER_AUTHORIZED);
    if (USER_AUTHORIZED == "true") {
        
        if (MAIN_MENU.classList.contains('open')){
            MAIN_MENU.classList.toggle('open');
            SIDE_CONTAINER_A.classList.toggle('open');

            if (scroll) {
                if (SIDE_CONTAINER_A.classList.contains('yb-lockScroll-y')){
                    SIDE_CONTAINER_A.classList.remove('yb-lockScroll-y');
                    SIDE_CONTAINER_A.classList.add('vScroll');
                } else {
                    SIDE_CONTAINER_A.classList.add('vScroll');
                } 
            } else {
                if (SIDE_CONTAINER_A.classList.contains('vScroll')){
                    SIDE_CONTAINER_A.classList.remove('vScroll');
                    SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                } else {
                    SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                }
            }
        

            //Toggle loading screen on newly active container
            tw_showLoading();

            //Return the action of the container and the container element to be loaded
            return ["switching", SIDE_CONTAINER_A];
        } else {
            let this_id;
            let active_type;

            //Iterate through all 2 way containers (A and B)
            for (let i = 0; i < SIDE_CONTAINERS.length + 1; i++) {
                
                //Check if current side container is open
                if (SIDE_CONTAINERS[i].classList.contains("open")){

                    //Get the ID of the current container
                    this_id = SIDE_CONTAINERS[i].getAttribute("id");
                    
                    //Get the type of the current container
                    active_type = SIDE_CONTAINERS[i].getAttribute("data-state"); //this is the same as the template key in the two way index


                    console.log(active_type)
                    console.log(type)

                    //Compare active_type to type, if its a match, close the container
                    if (active_type === type){
                        console.log(active_type)
                        console.log("container is already open");
                        try {
                            yb_2WayPage(1);
                        } catch {
                            console.log("No secondary page to clear")
                        }
                        
                        
                        SIDE_CONTAINERS[i].classList.toggle("open");

                        //Clear contents from container to avoid memory leaks
                        yb_clear2WayContainer(SIDE_CONTAINERS[i]);

                        //Check if the current core page is not fullscreen before showing UI
                        if (yb_getSessionValues('fullscreen') == "false"){
                            

                            MOBILE_HEADER.classList.remove("hide");
                            
                            NAV_BAR.classList.remove("hideMobile");
                            CREATE_POPOUT.classList.remove("hide");
                            SEARCH_POPOUT.classList.remove("hide");
                        
                            
                        } else {
                            if (yb_getSessionValues("location") != "customize-main"){
                                
                                MOBILE_HEADER.classList.remove("hide");
                            
                            }

                        }

                        //When closing a container, clear the URL
                        history.pushState(null, null, "/");

                        //Return the action of the container and the container element to be closed
                        return ["closing", SIDE_CONTAINERS[i]];
                        
                    } else {
                        if (this_id === 'yb-dynamic-2way-a'){
                            
                            console.log("container_a is open");
                            SIDE_CONTAINER_A.classList.toggle("open");
                            try {
                                yb_2WayPage(1);
                            } catch {
                                console.log("No secondary page to clear")
                            }
                            yb_clear2WayContainer(SIDE_CONTAINER_A);
                            
                            SIDE_CONTAINER_B.classList.toggle("open");

                            if (scroll) {
                                if (SIDE_CONTAINER_B.classList.contains('yb-lockScroll-y')){
                                    SIDE_CONTAINER_B.classList.remove('yb-lockScroll-y');
                                    SIDE_CONTAINER_B.classList.add('vScroll');
                                } else {
                                    SIDE_CONTAINER_B.classList.add('vScroll');
                                } 
                            } else {
                                if (SIDE_CONTAINER_B.classList.contains('vScroll')){
                                    SIDE_CONTAINER_B.classList.remove('vScroll');
                                    SIDE_CONTAINER_B.classList.add('yb-lockScroll-y');
                                } else {
                                    SIDE_CONTAINER_B.classList.add('yb-lockScroll-y');
                                }
                            }

                            tw_showLoading();
                            
                            
                            return ["switching", SIDE_CONTAINER_B];

                        } else {

                            console.log("container_b is open");

                            SIDE_CONTAINER_B.classList.toggle("open");
                            try {
                                yb_2WayPage(1);
                            } catch {
                                console.log("No secondary page to clear")
                            }
                            yb_clear2WayContainer(SIDE_CONTAINER_B);
                            
                            SIDE_CONTAINER_A.classList.toggle("open");

                            if (scroll) {
                                if (SIDE_CONTAINER_A.classList.contains('yb-lockScroll-y')){
                                    SIDE_CONTAINER_A.classList.remove('yb-lockScroll-y');
                                    SIDE_CONTAINER_A.classList.add('vScroll');
                                } else {
                                    SIDE_CONTAINER_A.classList.add('vScroll');
                                } 
                            } else {
                                if (SIDE_CONTAINER_A.classList.contains('vScroll')){
                                    SIDE_CONTAINER_A.classList.remove('vScroll');
                                    SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                                } else {
                                    SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                                }
                            }

                            tw_showLoading
                            return ["switching", SIDE_CONTAINER_A];
                        } 
                    }
                } else {
                    if (i === SIDE_CONTAINERS.length - 1){
                        yb_clear2WayContainer(SIDE_CONTAINER_A);
                        
                        MOBILE_HEADER.classList.add("hide");
                        NAV_BAR.classList.add("hideMobile");
                        SIDE_CONTAINER_A.classList.add("open");
                        CREATE_POPOUT.classList.add("hide");
                        SEARCH_POPOUT.classList.add("hide");

                        if (scroll) {
                            if (SIDE_CONTAINER_A.classList.contains('yb-lockScroll-y')){
                                SIDE_CONTAINER_A.classList.remove('yb-lockScroll-y');
                                SIDE_CONTAINER_A.classList.add('vScroll');
                            } else {
                                SIDE_CONTAINER_A.classList.add('vScroll');
                            } 
                        } else {
                            if (SIDE_CONTAINER_A.classList.contains('vScroll')){
                                SIDE_CONTAINER_A.classList.remove('vScroll');
                                SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                            } else {
                                SIDE_CONTAINER_A.classList.add('yb-lockScroll-y');
                            }
                        }
                        tw_showLoading();
                        return ["opening", SIDE_CONTAINER_A];
                    }
                }
                
            }
        }
    }
    
    
}

function yb_getActive2Way() {
    for (let i = 0; i < SIDE_CONTAINERS.length; i++) {
        if (SIDE_CONTAINERS[i].classList.contains("open")){
            return SIDE_CONTAINERS[i];
        }
    }
}

function yb_showDrawerFocus(this_id) {
    let this_element = document.getElementById(this_id);
    this_element.classList.add("show");
}

function yb_hideDrawerFocus(this_id) {
    let this_element = document.getElementById(this_id);
    this_element.classList.remove("show");
}

function yb_focusOn(this_id, group_class) {
    let this_element = document.getElementById(this_id);
    this_element.classList.add("focus");
    this_element.classList.remove("preview");
    this_element.style.border = "none";


    let this_class = document.getElementsByClassName(group_class);

    for (let i = 0; i < this_class.length; i++) {
        if (this_class[i].id != this_id){
            this_class[i].classList.add("blurred");
            
        }
    }

}

function yb_focusOff(this_id, group_class) {
    let this_element = document.getElementById(this_id);
    this_element.classList.remove("focus");
    this_element.classList.add("preview");
    this_element.style.border = "2px solid white";
    

    let this_class = document.getElementsByClassName(group_class);

    for (let i = 0; i < this_class.length; i++) {
        if (this_class[i].id != this_id){
            this_class[i].classList.remove("blurred");
        }
    }

}

//Launch a 2 way container with a page defined in TWO_WAY_INDEX
function yb_launch2WayContainer(page, data=null) {
    
    let this_page = TWO_WAY_INDEX[page];
    console.log("settings shown")
    let container = yb_toggle2WayContainer(page, true);
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", page);
        $(container_content).html("");
        if (data) {
            $(container_content).load(this_page.template + data.toString() + "/");
        } else {
            $(container_content).load(this_page.template)
        }
        
        yb_filterScroll();
        history.pushState({}, "", this_page.url);
    }

    return "launched";
}

//Legacy function for closing a 2 way container **MARKED FOR REMOVAL**
function yb_close2WayContainer() {
    for (let i = 0; i < SIDE_CONTAINERS.length + 1; i++) {
        this_object = SIDE_CONTAINERS[i];
        if (this_object.classList.contains("open")){
            history.pushState(null, null, "/");
            this_object.classList.toggle("open");
            yb_clear2WayContainer(SIDE_CONTAINERS[i]);
            break;
        }
    }
}

/*
    --Card Functions--
    
*/

//Open a card with content from a specified source
function yb_openCard(content, data=null) {
    if (data) {
        $(CARD_CONTAINER).load(content + data.toString() + "/");
    } else {
        $(CARD_CONTAINER).load(content);
    }
    
    CARD_CONTAINER.classList.add("open");
    LAYER_DIVIDER_1.style.display = "block";
}

/*

    Content Focus Container

*/

const FOCUS_INDEX = {
    "bit" : {
        "template": "/bits/templates/bit/focus/",
        "url": "/bits/view/",
    },
    "video" : {
        "template": "/bits/templates/video/focus/",
        "url": "/bits/view/",
    }
}


//Open the content focus container with content from a specified source
function yb_openFocusContainer(template, data=null) {
    $(FOCUS_CONTAINER).fadeIn(500);
    if (data) {
        $(FOCUS_CONTAINER).load(FOCUS_INDEX[template].template + data.toString() + "/");
    } else {
        $(FOCUS_CONTAINER).load(FOCUS_INDEX[template].template);
    }

    history.pushState({}, "", FOCUS_INDEX[template].url + data.toString() + "/");
}

//Close the content focus container
function yb_closeFocusContainer(){
    $(FOCUS_CONTAINER).fadeOut(500);
    FOCUS_CONTAINER.innerHTML = "";
}


/*
    
    yb_displayPrompt:
        -Info-
            --This function allows for the rapid creation of user warnings, alerts, and confirmations

    How to use yb_displayPrompt():

        -Variables-
            --title (string): The title of the prompt (This will be placed in the header section, keep it short)
            --message (string): The message to be displayed in the body of the prompt
            --actions (object): An object containing the actions to be displayed in the footer of the prompt

        -actions = {
            "name": "The name of the action (string)"
            "label": "The label to be displayed on the button (string)"
            "color": "The color of the button (string)"
            "action" : "The function to be executed when the button is clicked (function)"

        The displayPrompt function does not need a back action defined, a buttion will automatically be appended for this purpose

        -Example-

            yb_displayPrompt(
                "Example Prompt", 
                "This prompt will be used as an example", 
                {
                    "action1": {
                        "name": "action1",
                        "label": "Action 1",
                        "color": "red",
                        "action": function(){
                            console.log("Action 1")
                        }
                    },
                    "action2": {
                        "name": "action2",
                        "label": "Action 2",
                        "color": "blue",
                        "action": function(){
                            console.log("Action 2")
                        }
                }
            })
    
*/

function yb_closePrompt(){
    
    TOP_LAYER.classList.remove("open");
    PROMPT_CONTAINER.classList.remove("open");

    PROMPT_TITLE.innerHTML = "";
    
    PROMPT_BODY.innerHTML = "";

    PROMPT_FOOTER.innerHTML = "";

}

function yb_displayPrompt(title = "", message = "", actions = {}){

    TOP_LAYER.classList.add("open");
    PROMPT_CONTAINER.classList.add("open");

    PROMPT_TITLE.innerHTML = `<h3 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">${title}</h3>`;

    PROMPT_BODY.innerHTML = `<p style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">${message}</p>`;

    if (actions.length === 0){
        let ok_button = yb_createButton("Back", "yb-button-flex squared small-wide font-white", "prompt-action-back", "Ok");
        ok_button.setAttribute("style", "background-color: var(--yb-button-color) !important; width: 100%;");
        ok_button.addEventListener("click", yb_closePrompt);
        PROMPT_FOOTER.appendChild(ok_button);
    } else {
        let back_button = yb_createButton("Back", "yb-button-flex squared small-wide font-white", "prompt-action-back", "Back");
        back_button.setAttribute("style", "background-color: rgb(55, 55, 55); width: 100%; color: white;");
        back_button.addEventListener("click", yb_closePrompt);
        PROMPT_FOOTER.appendChild(back_button);
    }

    for (let key in actions){
        let this_action = actions[key];
        let this_button = yb_createButton(this_action.name, "yb-button-flex squared small-wide font-white", `prompt-action-${key}`, this_action.label);
        this_button.addEventListener("click", this_action.action);
        this_button.setAttribute("style", `background-color: ${this_action.color} !important; width: 100%;`);
        PROMPT_FOOTER.appendChild(this_button);
    }

}

function yb_moreHScroll(container) {
    let scrollContainer = document.getElementById(container);
    let container_parent = scrollContainer.parentElement;
    let less_scroll_icon = container_parent.getElementsByClassName("less-hScroll")[0];
    let more_scroll_icon = container_parent.getElementsByClassName("more-hScroll")[0];

    more_scroll_icon.style.display = "none";
    less_scroll_icon.style.display = "block";

    //Scroll left to the end of the container
    scrollContainer.scrollLeft = scrollContainer.scrollWidth;
}

function yb_lessHScroll(container) {
    let scrollContainer = document.getElementById(container);
    let container_parent = scrollContainer.parentElement;
    let less_scroll_icon = container_parent.getElementsByClassName("less-hScroll")[0];
    let more_scroll_icon = container_parent.getElementsByClassName("more-hScroll")[0];

    more_scroll_icon.style.display = "block";
    less_scroll_icon.style.display = "none";

    //Scroll right to the beginning of the container
    scrollContainer.scrollLeft = 0;
}

  
function yb_openImage(this_id){
    
    $(PHOTO_VIEWER).load(`/bits/templates/image/${this_id}/`);
    PHOTO_VIEWER.classList.add("open");
    
}
