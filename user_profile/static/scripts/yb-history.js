$(document).ready(function() {
    let dataset = $("#yb-browse-nav").attr("data-dataset"); 
    let content_container = document.getElementById("content-container");
    
    let filter = yb_getSessionValues("filter");
    let sort = yb_getSessionValues("sort");
    let type = yb_getSessionValues("space");


    let data = {
        "type": type,
        "dataset":dataset,
        "filter": filter,
        "sort": sort,

    }

    yb_getFeed(data, hideSplash, true);

    yb_showSpaceBar();
    headerDropIn();

    let liked_button = document.getElementById("yb-liked-bits");
    let disliked_button = document.getElementById("yb-disliked-bits");
    let commented_button = document.getElementById("yb-commented-bits");
    let shared_button = document.getElementById("yb-shared-bits");

    liked_button.addEventListener("click", function(e){

        let current_element = e.currentTarget;
        let new_dataset = "liked"
        current_element.setAttribute("data-dataset", new_dataset);
        let new_filter = yb_getSessionValues("filter");
        let new_sort = yb_getSessionValues("sort");
        let new_type = yb_getSessionValues("space");

        //remove active class from all buttons
        let buttons = document.getElementsByClassName("filter-button");
        for (let i = 0; i < buttons.length; i++){
            buttons[i].classList.remove("active");
        }
        //add active class to current button
        current_element.classList.add("active");
        
        let new_data = {
            "type": new_type,
            "dataset": new_dataset,
            "filter": new_filter,
            "sort": new_sort,

        }
        yb_getFeed(new_data, hideSplash, true);
    });

    disliked_button.addEventListener("click", function(e){
            
        let current_element = e.currentTarget;
        let new_dataset = "disliked"
        current_element.setAttribute("data-dataset", new_dataset);
        let new_filter = yb_getSessionValues("filter");
        let new_sort = yb_getSessionValues("sort");
        let new_type = yb_getSessionValues("space");

        //remove active class from all buttons
        let buttons = document.getElementsByClassName("filter-button");
        for (let i = 0; i < buttons.length; i++){
            buttons[i].classList.remove("active");
        }
        //add active class to current button
        current_element.classList.add("active");
        
        let new_data = {
            "type": new_type,
            "dataset": new_dataset,
            "filter": new_filter,
            "sort": new_sort,

        }
        yb_getFeed(new_data, hideSplash, true);
    });

    commented_button.addEventListener("click", function(e){
                
        let current_element = e.currentTarget;
        let new_dataset = "commented"
        current_element.setAttribute("data-dataset", new_dataset);
        let new_filter = yb_getSessionValues("filter");
        let new_sort = yb_getSessionValues("sort");
        let new_type = yb_getSessionValues("space");

        //remove active class from all buttons
        let buttons = document.getElementsByClassName("filter-button");
        for (let i = 0; i < buttons.length; i++){
            buttons[i].classList.remove("active");
        }
        //add active class to current button
        current_element.classList.add("active");
        
        let new_data = {
            "type": new_type,
            "dataset": new_dataset,
            "filter": new_filter,
            "sort": new_sort,

        }
        yb_getFeed(new_data, hideSplash, true);
    });

    shared_button.addEventListener("click", function(e){
                        
        let current_element = e.currentTarget;
        let new_dataset = "shared"
        current_element.setAttribute("data-dataset", new_dataset);
        let new_filter = yb_getSessionValues("filter");
        let new_sort = yb_getSessionValues("sort");
        let new_type = yb_getSessionValues("space");

        //remove active class from all buttons
        let buttons = document.getElementsByClassName("filter-button");
        for (let i = 0; i < buttons.length; i++){
            buttons[i].classList.remove("active");
        }
        //add active class to current button
        current_element.classList.add("active");
        
        let new_data = {
            "type": new_type,
            "dataset": new_dataset,
            "filter": new_filter,
            "sort": new_sort,

        }
        yb_getFeed(new_data, hideSplash, true);
    });
    


});