try {
    var sort_buttons = document.getElementsByClassName("yb-filter-icon");

} catch {
    sort_buttons = document.getElementsByClassName("yb-filter-icon");
}

$(document).ready(function() {
    console.log("sort-panel-ready");
    for (var i = 0; i < sort_buttons.length; i++) {
        sort_buttons[i].addEventListener('click', function() {
            // Toggle the filter panel
            let filter_option = this.getAttribute("data-sort");
            let current_sort = yb_getSessionValues("sort");

            console.log("Current Sort: " + current_sort);

            //check if filter option is in the is in the current filter string
            if (current_sort.includes(filter_option)) {
                //remove the filter option
                current_sort = current_sort.replace(filter_option, "");
                //remove the active class
                this.classList.remove("active");

                yb_setSessionValues("sort", current_sort);
            } else {
                //add the filter option
                current_sort = filter_option;
                //add the active class
                this.classList.add("active");

                yb_setSessionValues("sort", current_sort);
            } 
            
            yb_setSessionValues('bitstream-page', 1);

            let current_container = yb_getBitContainer();
            
            current_container.classList.remove('open');
            current_container.innerHTML = "";
            
            yb_getFeed();
        });
    }
});