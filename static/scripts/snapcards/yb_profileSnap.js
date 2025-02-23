$(document).ready(function(){


    let list_items = document.querySelectorAll(".yb-listItem");
    
    for (let i = 0; i < list_items.length; i++){
        list_items[i].addEventListener("click", function(){
            let list_item = list_items[i];
            let list_item_id = list_item.getAttribute("data-username");
            
            let data={
                "list_item_id": list_item_id
                
            };
            
            yb_navigateTo(profile, data);
        });
    }
});