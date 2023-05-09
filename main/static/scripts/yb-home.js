/****************************************
 *                                      *
 *     Global Variable Declarations     *
 *                                      *
 ****************************************/

//Page Base URL
var base_url = window.location.origin;
var feed_script = document.getElementById("feed-script")

$(document).ready(function() {
    console.log("document ready function ran");
    console.log(document.readyState)

    if (document.readyState === 'loading') {
        // DOM is still loading
          // DOM is ready
          // execute your code here
    } else {
        setTimeout(yb_InitializeHome, 500);
    }

    // all scripts have finished loading
    // do something here
    

});



function yb_InitializeHome(){
    let type = yb_getSessionValues("space");
    console.log("home initialized")
    let is_loaded = yb_getLoaded();
    if (is_loaded == true) {
        console.log("home already loaded")

    } else {
        showSpaceSplash('#yourbit-splash');
    }

    data = {
        "type":"global",
        "filter":"all",
        "sort":"chrono",
    }
    yb_getFeed(data, hideMainSplash, yb_getDisplay, true);
    setTimeout(initUI, 100);
    yb_showMenuTask(); 
}

/*          
                Home Feed Filters


*/


$('.filter-button-wide-active').change(function() {

    //Create form data to send to yourbit request function

    let filter = document.getElementById('yb-filter-dropdown').value;
    let sort = document.getElementById('yb-sort-dropdown').value;
    let type = yb_getSessionValues("space");
    let location = yb_getSessionValues("location");
    let this_data = {
        "filter": filter,
        "sort":sort,
        "type":type,

    }

    yb_getFeed(this_data, hideSplash, 0);

});

function yb_toggleOff(container) {
    if (container.getAttribute("name") === "time" || container.getAttribute("name") === "best" || container.getAttribute("name") === "trendiest") {
        let status = container.querySelector(".filter-option-status");
        status.innerHTML = "inactive";
        status.style.color = "#282828";
    } else {
        let status = container.querySelector(".filter-option-status");
        status.innerHTML = "OFF";
        status.style.color = "red";
    }

    let icon = container.querySelector("path");
    let text = container.querySelector("p");
    let checkbox = container.querySelector("input");
    container.setAttribute("data-status", "unchecked");
    checkbox.checked = false;
    icon.style.fill = "#282828";
    text.style.color = "#282828";

}

function yb_toggleOn(container) {
    
    if (container.getAttribute("name") === "time" || container.getAttribute("name") === "best" || container.getAttribute("name") === "trendiest") {
        yb_resetButtons();
        let status = container.querySelector(".filter-option-status");
        status.innerHTML = "Active";
        status.style.color = "blue";
    } else {
        let status = container.querySelector(".filter-option-status");
        status.innerHTML = "ON";
        status.style.color = "green";
    }

    console.log("toggle on")
    console.log(container)
    let icon = container.querySelector("path");
    let text = container.querySelector("p");
    let checkbox = container.querySelector("input");
    container.setAttribute("data-status", "checked");
    checkbox.checked = true;
    icon.style.fill = "white";
    text.style.color = "white";

}

function yb_resetButtons() {
    let container = document.querySelector(".sub-filter-container");
    let buttons = container.querySelectorAll("div");
    console.log(buttons)
    for (var i = 0; i < buttons.length; i++) {
        
        yb_toggleOff(buttons[i]);
    }
}

$('.filter-button-active').click(function() {
    let this_button = $(this).attr("name");
    let current_state = $(this).attr("data-state");
    let browse_nav = document.getElementById("yb-browse-nav");
    $(".container-header").remove();
    if (current_state === "contracted") {
        //If this button is the more filters button

        if (this_button === "advanced-filter"){
            $(this).attr("data-state", "expanded")
            $("#button-filter-search").attr("data-state", "contracted");
            $("#button-filter-customize").attr("data-state", "contracted");
            $(".sub-filter-container").remove();

            $("#yb-browse-nav").attr("data-state", "expanded");
            $("#yb-browse-nav").animate({"height":"300px"}, "fast");
            $(".filter-button-active").css({"margin-top":"7px"});
            $(".filter-button-wide-active").css({"margin-top":"7px"});

            //Create a new container to hold the form
            let new_container = yb_createElement("form", "sub-feed-filters", "sub-filter-container");
            new_container.setAttribute("style", "color:white; margin-bottom: 10px;");

            let header = yb_createElement("h4", "sub-feed-filters", "container-header");
            header.setAttribute("style", "color:white; text-align:center; margin-top:10px; margin-bottom:10px; grid-column:1/6;");
            header.innerHTML = "Show In Bitstream:";

            browse_nav.appendChild(header);


            let friend_check = yb_createElement("div", "friend-container", "filter-option-1");
            
            friend_check.setAttribute("data-status", "unchecked");

            friend_check.innerHTML = `
            <input type="checkbox" style="display:none" id="friend-filter" name="friend-filter" value="friends">
            <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill: #282828;" d="M26 17.958q.958 0 1.646-.666.687-.667.687-1.667 0-.958-.687-1.646-.688-.687-1.646-.687t-1.646.687q-.687.688-.687 1.646 0 1 .687 1.667.688.666 1.646.666Zm-12 0q.958 0 1.646-.666.687-.667.687-1.667 0-.958-.687-1.646-.688-.687-1.646-.687t-1.646.687q-.687.688-.687 1.646 0 1 .687 1.667.688.666 1.646.666Zm6 11.167q2.792 0 5.104-1.521 2.313-1.521 3.354-4.062h-2.375q-.958 1.625-2.562 2.52-1.604.896-3.521.896-1.875 0-3.5-.896-1.625-.895-2.542-2.52h-2.416q1.083 2.541 3.375 4.062 2.291 1.521 5.083 1.521Zm0 7.542q-3.458 0-6.5-1.313-3.042-1.312-5.292-3.562T4.646 26.5Q3.333 23.458 3.333 20t1.313-6.5q1.312-3.042 3.562-5.292T13.5 4.646q3.042-1.313 6.5-1.313t6.5 1.313q3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5t-1.313 6.5q-1.312 3.042-3.562 5.292T26.5 35.354q-3.042 1.313-6.5 1.313ZM20 20Zm0 13.875q5.833 0 9.854-4.021 4.021-4.021 4.021-9.854 0-5.833-4.021-9.854Q25.833 6.125 20 6.125q-5.833 0-9.854 4.021Q6.125 14.167 6.125 20q0 5.833 4.021 9.854 4.021 4.021 9.854 4.021Z"/></svg>
                <p class = "filter-option-label">Friends</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `
           
            friend_check.addEventListener("click", function() {
                let current_status = friend_check.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(friend_check);
                    
                } else {
                    yb_toggleOff(friend_check);
                }
            });

            new_container.appendChild(friend_check);


            let follow_check = yb_createElement("div", "follow-container", "filter-option-2");
            
            follow_check.setAttribute("data-status", "unchecked");

            follow_check.addEventListener("click", function() {
                let current_state = $(this).attr("data-status");
                if (current_state === "unchecked") {
                    yb_toggleOn(this);
                } else {
                    yb_toggleOff(this);
                }
            })

            

            follow_check.innerHTML = `
            <input type="checkbox" style="display:none" id="follow-filter" name="follow-filter" value="follow">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill: #282828;" d="M1.625 33.333v-4.166q0-1.459.729-2.646.729-1.188 2.021-1.771 2.917-1.333 5.417-1.938 2.5-.604 5.166-.604 2.625 0 5.125.604 2.5.605 5.375 1.938 1.292.583 2.063 1.771.771 1.187.771 2.646v4.166Zm29.417 0v-4.291q0-2.334-1.23-4.021-1.229-1.688-3.27-2.813 2.625.334 4.937.959 2.313.625 3.896 1.458 1.417.833 2.208 1.937.792 1.105.792 2.48v4.291ZM14.958 19.958q-2.75 0-4.583-1.812-1.833-1.813-1.833-4.563t1.833-4.562q1.833-1.813 4.583-1.813t4.563 1.813q1.812 1.812 1.812 4.562t-1.812 4.563q-1.813 1.812-4.563 1.812ZM30.5 13.583q0 2.75-1.812 4.563-1.813 1.812-4.563 1.812-.458 0-1.083-.062-.625-.063-1.084-.229 1.042-1.125 1.604-2.688.563-1.562.563-3.396 0-1.833-.563-3.333Q23 8.75 21.958 7.5q.5-.167 1.084-.229.583-.063 1.083-.063 2.75 0 4.563 1.813 1.812 1.812 1.812 4.562ZM4.375 30.542H25.5v-1.375q0-.584-.333-1.125-.334-.542-.875-.792-2.75-1.25-4.875-1.75t-4.459-.5q-2.375 0-4.52.5-2.146.5-4.896 1.75-.5.25-.834.792-.333.541-.333 1.125Zm10.583-13.334q1.542 0 2.563-1.041 1.021-1.042 1.021-2.584 0-1.541-1.021-2.583-1.021-1.042-2.563-1.042-1.541 0-2.583 1.042-1.042 1.042-1.042 2.583 0 1.542 1.042 2.584 1.042 1.041 2.583 1.041Zm0 13.334Zm0-16.959Z"/></svg>
                <p class = "filter-option-label">Following</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `
            new_container.appendChild(follow_check);

            let community_check = yb_createElement("div", "community-container", "filter-option-3");
            
            community_check.setAttribute("data-status", "unchecked");
            
            community_check.innerHTML = `
            <input style="display:none" type="checkbox" id="community-filter" name="community-filter" value="community">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill: #282828;" d="M1.667 33.333v-6.666q0-1.292.895-2.167.896-.875 2.146-.875h5.75q.75 0 1.438.375.687.375 1.146 1 1.208 1.708 3.041 2.667 1.834.958 3.917.958 2.083 0 3.938-.958Q25.792 26.708 27 25q.5-.625 1.146-1 .646-.375 1.396-.375h5.75q1.25 0 2.146.875.895.875.895 2.167v6.666H27.208V28.75q-1.458 1.292-3.312 1.958-1.854.667-3.896.667-2 0-3.854-.687-1.854-.688-3.354-1.938v4.583ZM20 26.375q-1.5 0-2.875-.687-1.375-.688-2.25-1.938-.667-1-1.646-1.583-.979-.584-2.146-.709 1.125-1.375 3.834-2.104 2.708-.729 5.083-.729t5.104.729q2.729.729 3.813 2.104-1.125.125-2.105.709-.979.583-1.645 1.583-.875 1.25-2.25 1.938-1.375.687-2.917.687Zm-13.333-5.25q-1.959 0-3.334-1.396t-1.375-3.354q0-1.958 1.375-3.333 1.375-1.375 3.334-1.375 2 0 3.354 1.375t1.354 3.333q0 1.958-1.354 3.354-1.354 1.396-3.354 1.396Zm26.666 0q-1.958 0-3.333-1.396-1.375-1.396-1.375-3.354 0-1.958 1.375-3.333 1.375-1.375 3.333-1.375 2 0 3.355 1.375 1.354 1.375 1.354 3.333 0 1.958-1.354 3.354-1.355 1.396-3.355 1.396Zm-13.333-5q-1.958 0-3.333-1.396-1.375-1.396-1.375-3.354 0-1.958 1.375-3.333Q18.042 6.667 20 6.667q2 0 3.354 1.375t1.354 3.333q0 1.958-1.354 3.354Q22 16.125 20 16.125Z"/></svg>
                <p class = "filter-option-label">Community</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `
            new_container.appendChild(community_check);

            
            let hide_me_check = yb_createElement("div", "hide-me-container", "filter-option-4");
            
            hide_me_check.setAttribute("data-status", "unchecked");
            
            hide_me_check.innerHTML = `
                <input style="display:none" type="checkbox" id="hide-me-filter" name="hide-me-filter" value="hide-me">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill: #282828;" d="M20 19.958q-2.75 0-4.562-1.812-1.813-1.813-1.813-4.563t1.813-4.562Q17.25 7.208 20 7.208t4.562 1.813q1.813 1.812 1.813 4.562t-1.813 4.563Q22.75 19.958 20 19.958ZM6.667 33.333v-4.166q0-1.542.77-2.688.771-1.146 2.021-1.729 2.709-1.25 5.313-1.896 2.604-.646 5.229-.646t5.208.646q2.584.646 5.334 1.896 1.25.625 2.02 1.75.771 1.125.771 2.667v4.166Zm2.791-2.791h21.084v-1.375q0-.584-.334-1.125-.333-.542-.833-.792-2.542-1.25-4.771-1.75T20 25q-2.375 0-4.625.5t-4.75 1.75q-.542.25-.854.792-.313.541-.313 1.125ZM20 17.208q1.542 0 2.583-1.041 1.042-1.042 1.042-2.584 0-1.541-1.042-2.583Q21.542 9.958 20 9.958q-1.542 0-2.583 1.042-1.042 1.042-1.042 2.583 0 1.542 1.042 2.584 1.041 1.041 2.583 1.041Zm0-3.625Zm0 16.959Z"/></svg>
                <p class = "filter-option-label">My Bits</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `
            new_container.appendChild(hide_me_check);

            let show_links_check = yb_createElement("div", "show-links-container", "filter-option-5");
            
            show_links_check.setAttribute("data-status", "unchecked");

            show_links_check.innerHTML = `
                <input style="display:none" type="checkbox" id="show-links-filter" name="show-links-filter" value="show-links">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill: #282828;" d="M18.625 28.333h-6.958q-3.459 0-5.896-2.437Q3.333 23.458 3.333 20q0-3.458 2.438-5.896 2.437-2.437 5.896-2.437h6.958v2.791h-6.958q-2.334 0-3.938 1.604Q6.125 17.667 6.125 20q0 2.292 1.604 3.917t3.938 1.625h6.958Zm-5.167-6.958v-2.75h13.084v2.75Zm7.917 6.958v-2.791h6.958q2.334 0 3.938-1.604 1.604-1.605 1.604-3.938 0-2.292-1.604-3.917t-3.938-1.625h-6.958v-2.791h6.958q3.459 0 5.896 2.437 2.438 2.438 2.438 5.896 0 3.458-2.438 5.896-2.437 2.437-5.896 2.437Z"/></svg>
                <p class = "filter-option-label">Links</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `

            new_container.appendChild(show_links_check);
            browse_nav.appendChild(new_container);

            yb_loadInclusionFilter();

        }

        if (this_button === "sort-filter"){
            $(this).attr("data-state", "expanded")

            $("#button-filter-options").attr("data-state", "contracted");
            $("#button-filter-customize").attr("data-state", "contracted");
            $(".sub-filter-container").remove();

            $("#yb-browse-nav").attr("data-state", "sort-filter");
            $("#yb-browse-nav").animate({"height":"200px"}, "fast");
            $(".filter-button-active").css({"margin-top":"7px"});
            $(".filter-button-wide-active").css({"margin-top":"7px"});
            
            let header = yb_createElement("h4", "sub-feed-filters", "container-header");
            header.setAttribute("style", "color:white; text-align:center; margin-top:10px; margin-bottom:10px; grid-column:1/6;");
            header.innerHTML = "Sort by:";

            browse_nav.appendChild(header);

            //Create container to hold search button and search input
            let sort_filter_container = yb_createElement("div", "sub-feed-filters", "sub-filter-container");

            let chrono_check = yb_createElement("div", "chrono-container", "filter-option-1");
            chrono_check.setAttribute("name", "time");
            chrono_check.setAttribute("data-status", "unchecked");

            chrono_check.innerHTML = `
            <input type="checkbox" name="sort-filter" id="chrono" value="chrono" style="display:none"> 
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill:rgb(40, 40, 40);" d="m24.542 27.458-5.917-5.916v-8.209h2.75v7.084l5.083 5.083Zm-5.917-17.75V6.125h2.75v3.583Zm11.667 11.667v-2.75h3.583v2.75Zm-11.667 12.5v-3.583h2.75v3.583Zm-12.5-12.5v-2.75h3.583v2.75ZM20 36.667q-3.458 0-6.479-1.313-3.021-1.312-5.292-3.583t-3.583-5.292Q3.333 23.458 3.333 20t1.313-6.5q1.312-3.042 3.583-5.292t5.292-3.562Q16.542 3.333 20 3.333t6.5 1.313q3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5t-1.313 6.479q-1.312 3.021-3.562 5.292T26.5 35.354q-3.042 1.313-6.5 1.313Zm0-2.792q5.792 0 9.833-4.042 4.042-4.041 4.042-9.833t-4.021-9.833Q25.833 6.125 20 6.125q-5.792 0-9.833 4.021Q6.125 14.167 6.125 20q0 5.792 4.042 9.833 4.041 4.042 9.833 4.042ZM20 20Z"/></svg>
                <p class="filter-option-label">Time</p>
                <p class="filter-option-status">inactive</p>
            `
            sort_filter_container.appendChild(chrono_check);

            
            chrono_check.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);
                    data = {
                        "type":"global",
                        "filter":"all",
                        "sort":"chrono",
                    }
                    yb_getFeed(data, hideMainSplash, yb_getDisplay, true);
                    
                }
            });

            let best_check = yb_createElement("div", "best-container", "filter-option-2");
            
            best_check.setAttribute("name", "best");
            best_check.setAttribute("data-status", "unchecked");
            
            best_check.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);

                } else {
                    yb_toggleOff(this);
                }
            });

            best_check.innerHTML = `
                <input type="checkbox" name="sort-filter" id="best" value="best" style="display:none">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill:rgb(40, 40, 40);" d="M13.875 30.875 20 27.208l6.125 3.709-1.625-6.959 5.375-4.666-7.083-.625L20 12.125l-2.792 6.5-7.083.625 5.375 4.708Zm-4.167 5.792 2.709-11.709-9.084-7.875 12-1.041L20 5l4.667 11.042 12 1.041-9.084 7.875 2.709 11.709L20 30.458ZM20 21.958Z"/></svg>
                <p class = "filter-option-label">Likes</p>
                <p class="filter-option-status"><i>inactive</i></p>
                
            `
            sort_filter_container.appendChild(best_check);

            best_check.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);
                    data = {
                        "type":"global",
                        "filter":"all",
                        "sort":"best",
                    }
                    yb_getFeed(data, hideMainSplash, yb_getDisplay, true);
                    
                }
                
            });
            
            let trendiest_check = yb_createElement("div", "trendiest-container", "filter-option-3");
            
            trendiest_check.setAttribute("name", "trendiest");
            trendiest_check.setAttribute("data-status", "unchecked");
            
            trendiest_check.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);
                
                } else {
                    yb_toggleOff(this);
                }
            });

            trendiest_check.innerHTML = `
                <input type="checkbox" name="sort-filter" id="trendiest" value="trendiest" style="display:none">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40">
                    <path style="fill:rgb(40, 40, 40);" d="m5.292 30-1.959-1.958 12.209-12.25 6.875 6.875L32 13.125h-4.958v-2.792h9.625v9.625h-2.75v-4.833l-11.542 11.5-6.833-6.833Z"/>
                </svg>
                <p class = "filter-option-label">Trendiest</p>
                <p class="filter-option-status"><i>inactive</i></p>
                
            `
            sort_filter_container.appendChild(trendiest_check);
            

            browse_nav.appendChild(sort_filter_container);

            yb_loadSortFilter();


        }

        //If this button is the search button
        if (this_button === "search") {


            $(this).attr("data-state", "expanded")

            $("#button-filter-options").attr("data-state", "contracted");
            $("#button-filter-customize").attr("data-state", "contracted");
            $(".sub-filter-container").remove();

            $("#yb-browse-nav").attr("data-state", "search");
            $("#yb-browse-nav").animate({"height":"100px"}, "fast");
            $(".filter-button-active").css({"margin-top":"7px"});
            $(".filter-button-wide-active").css({"margin-top":"7px"});
            
            //Create container to hold search button and search input
            let search_container = yb_createElement("div", "sub-feed-filters", "sub-filter-container");

            search_container.setAttribute(
                "style", 
                    `position: absolute; 
                    left: 2.5%;
                    top: 40px; 
                    display: grid; 
                    grid-template-columns: 300px 50px; width: 98%;
                    background-color:rgba(0,0,0,0.0);
                    `
            );
            let space = yb_getSessionValues("space");
            let placeholder;
            if (space === "global") {
                placeholder = "Search " + space;
            } else {
                placeholder = "Search " + space + "s";
            }
            //Create search input
            let search_bar = yb_createInput("text", "yb-single-line-input", "input-filter-search", placeholder);

            search_bar.setAttribute("style", "position: relative; grid-column: 1; width: 300px;")
            
            //Create Search Button
            let search_button = yb_createButton("search", "filter-search-button", "wide-submit", 
            `
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                    <path 
                        style="fill:white" 
                        d="m19.825 21.65-6.35-6.35q-.75.575-1.837.912-1.088.338-2.213.338-2.975 0-5.037-2.062-2.063-2.063-2.063-5.038t2.063-5.038Q6.45 2.35 9.425 2.35t5.038 2.062q2.062 2.063 2.062 5.038 0 1.125-.312 2.15-.313 1.025-.913 1.825l6.375 6.375Zm-10.4-7.75q1.875 0 3.163-1.288 1.287-1.287 1.287-3.162t-1.287-3.163Q11.3 5 9.425 5 7.55 5 6.263 6.287 4.975 7.575 4.975 9.45q0 1.875 1.288 3.162Q7.55 13.9 9.425 13.9Z"
                    >
                    </path>
                </svg>
            `);
            search_button.setAttribute("style", "position: relative; display: block; top: 5px; margin:auto; background-color: darkgray; border-width: 0px; border-radius: 10px; grid-column: 2; width: 50px; height: 30px;")

            //Append search input to search container
            search_container.append(search_bar)
            
            //Append search button to search container
            search_container.appendChild(search_button);

            //Append search container to filter bar dropdown
            browse_nav.appendChild(search_container);
        }

        //If this button is the customizations button
        if (this_button === "customize") {
            $(this).attr("data-state", "expanded")
            $("#button-filter-options").attr("data-state", "contracted");
            $("#button-filter-search").attr("data-state", "contracted");
            $(".sub-filter-container").remove();

            $("#yb-browse-nav").attr("data-state", "filter");
            $("#yb-browse-nav").animate({"height":"290px"}, "fast");
            $(".filter-button-active").css({"margin-top":"7px"});
            $(".filter-button-wide-active").css({"margin-top":"7px"});

            let header = yb_createElement("h4", "sub-feed-filters", "container-header");
            header.setAttribute("style", "color:white; text-align:center; margin-top:10px; margin-bottom:10px; grid-column:1/6;");
            header.innerHTML = "Customize Toggles:";

            browse_nav.appendChild(header);


            let customize_container = yb_createElement("div", "sub-feed-filters", "sub-filter-container");
           

            let only_my_colors_check = yb_createElement("div", "my-color-check", "filter-option-1");
            only_my_colors_check.setAttribute("data-status", "unchecked")
            only_my_colors_check.innerHTML = `
                <input style="display:none;" type="checkbox" id="only-my-colors" name="only-my-colors" value="only-my-colors">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill:rgb(40, 40, 40);" d="M9.417 29.083q2.458-1.75 5.062-2.729 2.604-.979 5.521-.979t5.542.979q2.625.979 5.083 2.729Q32.333 27 33.104 24.75q.771-2.25.771-4.75 0-5.875-4-9.875t-9.875-4q-5.875 0-9.875 4t-4 9.875q0 2.5.792 4.75.791 2.25 2.5 4.333ZM20 21.375q-2.417 0-4.083-1.667-1.667-1.666-1.667-4.083 0-2.417 1.667-4.083Q17.583 9.875 20 9.875q2.417 0 4.083 1.667 1.667 1.666 1.667 4.083 0 2.458-1.667 4.104-1.666 1.646-4.083 1.646Zm0 15.292q-3.417 0-6.458-1.313-3.042-1.312-5.313-3.583t-3.583-5.292Q3.333 23.458 3.333 20t1.313-6.479Q5.958 10.5 8.229 8.229t5.292-3.583Q16.542 3.333 20 3.333t6.479 1.313q3.021 1.312 5.292 3.583t3.583 5.292q1.313 3.021 1.313 6.479 0 3.417-1.313 6.458-1.312 3.042-3.583 5.313t-5.292 3.583Q23.458 36.667 20 36.667Zm0-2.792q2.25 0 4.375-.646t4.083-2.187q-1.958-1.375-4.083-2.125T20 28.167q-2.25 0-4.375.75t-4.083 2.125q1.958 1.541 4.083 2.187 2.125.646 4.375.646Zm0-15.25q1.292 0 2.125-.833.833-.834.833-2.167 0-1.292-.833-2.125T20 12.667q-1.292 0-2.125.833t-.833 2.125q0 1.333.833 2.167.833.833 2.125.833Zm0-3Zm0 15.417Z"/></svg>
                <p class="filter-option-label">Only My Colors</p>
                <p class="filter-option-status" style="color: red; font-weight:bold;">OFF</p>
            `
            customize_container.appendChild(only_my_colors_check);
            only_my_colors_check.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);
                
                } else {
                    yb_toggleOff(this);
                }
            });


            let ui_color_check = yb_createElement("div", "ui-color-check", "filter-option-2");
            ui_color_check.setAttribute("data-status", "unchecked")
            ui_color_check.innerHTML = `
                <input style="display:none;" type="checkbox" id="ui-color" name="ui-color" value="ui-color">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill:rgb(40, 40, 40);" d="M20 36.667q-3.417 0-6.458-1.313-3.042-1.312-5.313-3.583t-3.583-5.313Q3.333 23.417 3.333 20q0-3.5 1.334-6.542Q6 10.417 8.312 8.167q2.313-2.25 5.417-3.542 3.104-1.292 6.646-1.292 3.292 0 6.25 1.125t5.187 3.105q2.23 1.979 3.542 4.687 1.313 2.708 1.313 5.917 0 4.583-2.729 7.187-2.73 2.604-6.98 2.604h-3.125q-.625 0-1.041.459-.417.458-.417 1 0 .916.625 1.75.625.833.625 1.958 0 1.75-.979 2.646-.979.896-2.646.896ZM20 20Zm-9.542 1.292q.917 0 1.584-.667.666-.667.666-1.583 0-.917-.666-1.563-.667-.646-1.584-.646-.916 0-1.562.646t-.646 1.563q0 .916.646 1.583.646.667 1.562.667Zm5.167-6.959q.917 0 1.583-.645.667-.646.667-1.563 0-.917-.667-1.583-.666-.667-1.583-.667-.917 0-1.563.667-.645.666-.645 1.583 0 .917.645 1.563.646.645 1.563.645Zm8.75 0q.917 0 1.563-.645.645-.646.645-1.563 0-.917-.645-1.583-.646-.667-1.563-.667-.917 0-1.583.667-.667.666-.667 1.583 0 .917.667 1.563.666.645 1.583.645Zm5.292 6.959q.916 0 1.562-.667t.646-1.583q0-.917-.646-1.563-.646-.646-1.562-.646-.917 0-1.563.646-.646.646-.646 1.563 0 .916.646 1.583.646.667 1.563.667ZM20 33.875q.417 0 .625-.187.208-.188.208-.563 0-.583-.604-1.187-.604-.605-.604-2.271 0-1.875 1.229-3.188 1.229-1.312 3.104-1.312h3q3 0 4.959-1.771 1.958-1.771 1.958-5.229 0-5.334-4.063-8.688-4.062-3.354-9.437-3.354-5.958 0-10.104 4.021Q6.125 14.167 6.125 20q0 5.75 4.063 9.812Q14.25 33.875 20 33.875Z"/></svg>
                <p class="filter-option-label">Toggle UI Color</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `
            customize_container.appendChild(ui_color_check);
            ui_color_check.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);
                    
                } else {
                    yb_toggleOff(this);
                }
            });


            let text_color_check = yb_createElement("div", "text-color-check", "filter-option-3");
            text_color_check.setAttribute("data-status", "unchecked")
            text_color_check.innerHTML = `
                <input style="display:none;" type="checkbox" id="text-color" name="text-color" value="text-color">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill:rgb(40, 40, 40);" d="M3.625 40v-6.125h32.75V40Zm5.542-11.667L18.208 5h3.584l9.041 23.333h-3.416l-2.292-6.166h-10.25l-2.292 6.166Zm6.791-9.041h8.084l-3.959-10.75h-.166Z"/></svg>
                <p class="filter-option-label">Toggle Text Colors</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `
            customize_container.appendChild(text_color_check);
            text_color_check.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);

                } else {
                    yb_toggleOff(this);
                }
            });
            

            let toggle_wallpaper = yb_createElement("div", "wallpaper-check", "filter-option-4");
            toggle_wallpaper.setAttribute("data-status", "unchecked")
            toggle_wallpaper.innerHTML = `
                <input style="display:none;" type="checkbox" id="toggle-wallpaper" name="toggle-wallpaper" value="toggle-wallpaper" checked>
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill:rgb(40, 40, 40);" d="M7.792 35q-1.125 0-1.959-.833Q5 33.333 5 32.208V21.375h2.792v10.833h10.833V35Zm13.583 0v-2.792h10.833V21.375H35v10.833q0 1.125-.833 1.959-.834.833-1.959.833ZM9.917 28.667l4.958-6.459 3.833 5.209 5.334-6.959 6.166 8.209ZM5 18.625V7.792q0-1.125.833-1.959Q6.667 5 7.792 5h10.833v2.792H7.792v10.833Zm27.208 0V7.792H21.375V5h10.833q1.125 0 1.959.833.833.834.833 1.959v10.833Zm-6.25-2.25q-1.041 0-1.687-.646-.646-.646-.646-1.687 0-1 .646-1.667t1.687-.667q1 0 1.667.667t.667 1.667q0 1.041-.667 1.687-.667.646-1.667.646Z"/></svg>
                <p class="filter-option-label">Toggle Wallpaper</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `
            customize_container.appendChild(toggle_wallpaper);
            toggle_wallpaper.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);

                } else {
                    yb_toggleOff(this);
                }
            });

            let bit_color_check = yb_createElement("div", "bit-color-check", "filter-option-5");
            bit_color_check.setAttribute("data-status", "unchecked")
            bit_color_check.innerHTML = `
                <input style="display:none;" type="checkbox" id="bit-color" name="bit-color" value="bit-color">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path style="fill:rgb(40, 40, 40);" d="M20 36.667q-3.417 0-6.458-1.313-3.042-1.312-5.313-3.583t-3.583-5.313Q3.333 23.417 3.333 20q0-3.5 1.334-6.542Q6 10.417 8.312 8.167q2.313-2.25 5.417-3.542 3.104-1.292 6.646-1.292 3.292 0 6.25 1.125t5.187 3.105q2.23 1.979 3.542 4.687 1.313 2.708 1.313 5.917 0 4.583-2.729 7.187-2.73 2.604-6.98 2.604h-3.125q-.625 0-1.041.459-.417.458-.417 1 0 .916.625 1.75.625.833.625 1.958 0 1.75-.979 2.646-.979.896-2.646.896ZM20 20Zm-9.542 1.292q.917 0 1.584-.667.666-.667.666-1.583 0-.917-.666-1.563-.667-.646-1.584-.646-.916 0-1.562.646t-.646 1.563q0 .916.646 1.583.646.667 1.562.667Zm5.167-6.959q.917 0 1.583-.645.667-.646.667-1.563 0-.917-.667-1.583-.666-.667-1.583-.667-.917 0-1.563.667-.645.666-.645 1.583 0 .917.645 1.563.646.645 1.563.645Zm8.75 0q.917 0 1.563-.645.645-.646.645-1.563 0-.917-.645-1.583-.646-.667-1.563-.667-.917 0-1.583.667-.667.666-.667 1.583 0 .917.667 1.563.666.645 1.583.645Zm5.292 6.959q.916 0 1.562-.667t.646-1.583q0-.917-.646-1.563-.646-.646-1.562-.646-.917 0-1.563.646-.646.646-.646 1.563 0 .916.646 1.583.646.667 1.563.667ZM20 33.875q.417 0 .625-.187.208-.188.208-.563 0-.583-.604-1.187-.604-.605-.604-2.271 0-1.875 1.229-3.188 1.229-1.312 3.104-1.312h3q3 0 4.959-1.771 1.958-1.771 1.958-5.229 0-5.334-4.063-8.688-4.062-3.354-9.437-3.354-5.958 0-10.104 4.021Q6.125 14.167 6.125 20q0 5.75 4.063 9.812Q14.25 33.875 20 33.875Z"/></svg>
                <p class="filter-option-label">Toggle Bit Colors</p>
                <p class="filter-option-status" style="color:red; font-weight:bold;">OFF</p>
            `
            customize_container.appendChild(bit_color_check);

            bit_color_check.addEventListener("click", function() {
                let current_status = this.getAttribute("data-status");
                if (current_status === "unchecked") {
                    yb_toggleOn(this);

                } else {
                    yb_toggleOff(this);
                }
            });
                        
            browse_nav.appendChild(customize_container);
            yb_loadCustomFilter();
        }

    } else {
        $(".sub-filter-container").remove();
        $(this).attr("data-state", "contracted");
        $("#yb-browse-nav").attr("data-state", "contracted");
        $("#yb-browse-nav").animate({"height":"40px"}, "fast");
        $(".filter-button-active").removeProp("margin-top");
        $(".filter-button-wide-active").removeProp("margin-top");
    }
});



$('#input-feed-search').change(function(){
    let query = $(this).attr("value");
    let type = yb_getSessionValues("space");
    yb_bitSearch(type, query);

});


function getUserInteractions(id, bg_color, color){
    let url = `${base_url}/api/interactions/?id=${id}/`
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        if (data.is_liked === true) {
            $(`#like-${id}`).css({'background-color':bg_color});
            $(`#like-icon-${id}`).css({'background-color':color});
        }
        if (data.is_disliked === true) {
            $(`#dislike-${id}`).css({'background-color':bg_color});
            $(`#dislike-icon-${id}`).css({'background-color':color});
        }

    })

}


function popIn() {
    let bit = document.getElementById('bit-3');
    console.log(bit)
    let bit_container = document.getElementById('bit-container')
    let new_node = document.createElement("h2");
    new_node.innerHTML = "Test";
    console.log(new_node)
    bit.parentNode.insertBefore(new_node, bit.nextSibling);
}

