try {
    var panel_buttons = document.getElementsByClassName("yb-filter-icon");
}
catch (e) {
    console.log(e);
    panel_buttons = document.getElementsByClassName("yb-filter-icon");
}

// Add event listeners to the filter panel buttons
$(document).ready(function() {
    console.log("filter-panel-ready");
    for (var i = 0; i < panel_buttons.length; i++) {
        panel_buttons[i].addEventListener('click', function() {
            // Toggle the filter panel
            let filter_option = this.getAttribute("data-filter");
            let current_filter = yb_getSessionValues("filter");

            //check if filter option is in the is in the current filter string
            if (current_filter.includes("-"+filter_option)) {
                //remove the filter option
                current_filter = current_filter.replace(filter_option, "");
                //remove the active class
                this.classList.remove("active");

                yb_setSessionValues("filter", current_filter);
            } else {
                //add the filter option
                current_filter += "-"+filter_option;
                //add the active class
                this.classList.add("active");

                yb_setSessionValues("filter", current_filter);
            } 
            
            yb_setSessionValues('bitstream-page', 1);

            let current_container = yb_getBitContainer();
            
            current_container.classList.remove('open');
            current_container.innerHTML = "";
            
            yb_getFeed();
        });
    }
});
