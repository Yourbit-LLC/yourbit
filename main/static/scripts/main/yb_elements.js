//Function for generating list items
function yb_buildListItem(result, action=null){
    let id = result.id
    let user = result.user

    let name = result.display_name;
    let handle = user.username;
    let element_id = `${type}-${id}`;
    let new_item = yb_createElement("div", "full-result yb-autoText", `result-${element_id}`,);
    new_item.setAttribute("data-catid", `${id}`);
    new_item.setAttribute("data-username", `${handle}`);
    new_item.innerHTML =`
        
            <div class = 'full-result-image-container'>
                <img class='full-result-image' style="width: 100%; position:relative;" src="${result.customcore.profile_image.small_thumbnail}">
            </div>
            <div class='full-result-name-container'>
                <p class = 'full-result-name'><strong>${name}</strong></p>
                <p class = 'full-result-username'>
                    <small>@${handle}</small>
                </p>
            </div>
    `

    if (action != null) {
        let handler = action(id, handle)
        new_item.addEventListener('click', handler)
        
    }
    
    return new_item
}

//Function for generating list items
function yb_buildContactItem(result, type){
    let id = result.this_id
    let primary_color = result.primary_color;
    let image = result.image_thumbnail_small;
    let name = result.name;
    let handle = result.username;
    let element_id = `${type}-${id}`;
    let new_item = yb_createElement("div", `result-${element_id}`, "full-result");
    new_item.setAttribute("style", `background-color: ${primary_color};`);
    new_item.setAttribute("data-catid", `${result.this_id}`);
    new_item.innerHTML =`
        
            <div class = 'full-result-image-container'>
                <img class='full-result-image' src="${image}">
            </div>
            <div class='full-result-name-container'>
                <p class = 'full-result-name'><strong>${name}</strong></p>
                <p class = 'full-result-username'>
                    <small>@${handle}</small>
                </p>
            </div>
    `
    new_item.addEventListener('click', function() {
        
        messages_conversation_url(id, handle);
        yb_endTask("#message-task")
        yb_hideWidget()
        $(".minibar").animate({"bottom":"-60px"}).fadeOut();

    })
    return new_item
}

function yb_buildFieldTag(label, id) {
    let new_tag = yb_createElement("div", "field-tag yb-flexRow squared", `tag-${id}`);
    new_tag.innerHTML = `
        <p class="field-tag-label yb-autoText yb-margin-L5">${label}</p>
        <button class="field-tag-delete" style=" border-width: 0px; color: red; background-color: transparent; font-size: 24px;" data-catid="${id}">&times</button>
    `;
    return new_tag
}
