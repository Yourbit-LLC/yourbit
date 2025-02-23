function yb_createElement(type, yb_class, yb_id) {
    let new_element = document.createElement(type);
    new_element.setAttribute("id", yb_id);
    new_element.setAttribute("class", yb_class);

    return new_element;

}

function yb_renderImage(source, yb_class, yb_id, alt) {
    let new_element = yb_createElement("img", yb_class, yb_id);
    
    new_element.setAttribute("src", source);
    new_element.setAttribute("alt", alt);

    return new_element;

}

function yb_renderVideo(source, yb_class, yb_id, alt) {
    let new_element = yb_createElement("video", yb_class, yb_id);
    
    new_element.setAttribute("src", source);
    new_element.setAttribute("alt", alt);

    return new_element;

}


function yb_createButton(name, yb_class, yb_id, label, action=null) {
    let new_element = yb_createElement("button", yb_class, yb_id);

    new_element.setAttribute("name", name);

    new_element.innerHTML = label

    new_element.addEventListener("click", action);

    return new_element;

}

function yb_createInput(type, yb_class, yb_id, placeholder) {
    let new_element;
    
    if (type === "textarea"){
        new_element = yb_createElement("textarea", yb_class, yb_id);
    } 

    else {
        new_element = yb_createElement("input", yb_class, yb_id);
        new_element.setAttribute("type", type);
    }

    if (placeholder != "none"){
        new_element.setAttribute("placeholder", placeholder);
    }

    return new_element;
}

function yb_createLabel(label_for, yb_class, yb_id, text){
    let new_element = yb_createElement("label", yb_class, yb_id);
    new_element.setAttribute("for", label_for);
    new_element.innerHTML = text;
    return new_element;
}

function yb_createSnapCard(type) {
    let new_element = yb_createElement("div", "yb-snapCard", "snap-card");
    let header = yb_createElement("div", "yb-card-header", "snap-card-header");
    let body = yb_createElement("div", "yb-card-body", "snap-card-body");
    let footer = yb_createElement("div", "yb-card-footer", "snap-card-footer");

    let header_text = yb_createElement("h3", "yb-card-header-text", "snap-card-header-text");
    header_text.innerHTML = type;

    header.appendChild(header_text);

    let close_button = yb_createButton("close", "yb-button-close card", "snap-card-close-button", "X", yb_closeSnapCard);
    header.appendChild(close_button);

    new_element.appendChild(header);
    

    return new_element;
}

//List type quarter card
function yb_createQuarterCardList(title, options) {
    let card = yb_createElement('div', 'yb-temporary-card', 'yb-card-quarter in');
    let card_title = yb_createElement('div', 'quarter-card-title', 'quarter-card-title');
    let card_title_text = yb_createElement('h3', 'quarter-card-title-text', 'quarter-card-title-text');
    card_title_text.setAttribute('style', 'text-align: center; color: white;')
    card_title_text.innerHTML = title;
    card_title.appendChild(card_title_text);
    card.appendChild(card_title);
    
    //Get options stored in a dictionary, the corresponding action functions are stored as values to the keys defining actions
    let card_options = yb_createElement('div', 'quarter-card-options', 'quarter-card-options');
    for (let key in options) {
        let lowkey = key.toLowerCase();
        let option = yb_createElement('div', 
            `'card-option-${lowkey}`, 
            'yb-single-line-input'
            );
        option.setAttribute(
            "style", 
            "margin-left: auto; margin-right: auto; text-align: center; background-color: rgba(50,50,50,0.4); line-height: 1.8; height: 32px;"
        );
        option.setAttribute('data-action', lowkey);

        option.innerHTML = key;
        card_options.appendChild(option);

        if (key==='Cancel') {
            option.style.color = 'red';
            option.style.borderColor = 'red';
            option.addEventListener('click', function() {
                yb_hideQuartercard();
            });
        } else {
            option.addEventListener('click', function() {
                yb_handleQuarterCardOption(options[key])
            });
        }
    }

    card.appendChild(card_options);
    
    document.body.appendChild(card);
}

