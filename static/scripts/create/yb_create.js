var options = document.querySelectorAll(".create-option");
var quick_bit_field = document.getElementById("quick-bit-input");

function yb_handleNewMessage() {
    let container = yb_toggle2WayContainer('messages-new');
    if (container[0] === "closing"){
        history.pushState(null, null, "/");
        container[1].setAttribute("data-state", "empty");
    } else {
        console.log("not closing")
        let container_content = container[1].querySelector(".yb-2Way-content");
        container[1].setAttribute("data-state", "messages-new");
        yb_purgeScripts(yb_clearContainer);
        
        $(container_content).load("/messages/templates/new-message/")

        history.pushState({}, "", '/messages/');
}
}
$(document).ready(function () {
    let container = document.getElementById("create-menu-content");
    let create_options = document.getElementById("create-options");
    yb_hide2WayLoad();
    for (var i = 0; i < options.length; i++) {
        options[i].addEventListener("click", function () {
            var option = this.getAttribute("name");

            if (option === "message") {
                yb_handleNewMessage();
                history.pushState({}, "", `/messages/`);


            } else{
                yb_2WayPage(2, `create-${option}`);
            }
            
        });
    }

    

    function yb_qbKey(e) {

        if (e.key === "Enter"){
            let csrf_token = getCSRF();
            e.preventDefault();
            new_bit = new FormData();
            new_bit.append("body", quick_bit_field.value);
            new_bit.append("type", "chat");

            yb_createBit(new_bit, csrf_token);
        }

    }

    quick_bit_field.addEventListener("keyup", function(){
        let submit_prompt = document.getElementById("quick-submit");
        console.log("quick field changed")
        if (quick_bit_field.value === ""){
            //If field is empty remove event listener
            console.log("field is empty")
            quick_bit_field.removeEventListener("keydown", yb_qbKey);
            submit_prompt.classList.remove("show")
            
        } else {
            //If enter is pressed add event yb_handleEnterSubmit
            console.log("field is not empty")
            quick_bit_field.addEventListener("keydown", yb_qbKey);
            if (!submit_prompt.classList.contains("show")){
                submit_prompt.classList.add("show")
            }
            
        }
    });

});