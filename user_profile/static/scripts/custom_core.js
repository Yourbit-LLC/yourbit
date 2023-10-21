//Grid type quarter card
function yb_quarter_card_custom(title, options) {
    let card = yb_createElement('div', 'yb-temporary-card', 'yb-card-quarter in');
    let card_title = yb_createElement('div', 'quarter-card-title', 'quarter-card-title');
    let card_title_text = yb_createElement('h3', 'quarter-card-title-text', 'quarter-card-title-text');
    card_title_text.setAttribute('style', 'text-align: center; color: white;');
    card_title_text.innerHTML = title;
    card_title.appendChild(card_title_text);
    card.appendChild(card_title);

    let card_options = yb_createElement('div', 'quarter-card-options', 'quarter-card-options');

    let h_option_container = yb_createElement("div", "yb-color-option-container", "yb-option-grid vsplit");
    let v_option_container = yb_createElement("div", "yb-button-option-container", "yb-option-grid hsplit");
    
    for (let key in options) {
        let lowkey = key.toLowerCase();
        
        let this_option = options[key];
        
        if (this_option.type = "color") {
            
            let icon = yb_createInput(this_option.type, `${lowkey}-color-circle`, "color-circle");
            let label = yb_createElement("p", `${lowkey}-option-label`, "yb-grid-option-label");
            label.innerHTML = `${key} Color`;
            h_option_container.appendChild(icon);

        }  else {
            let lowaction = this_option.action.toLowerCase();
            let label = yb_createElement("p", `${lowkey}-option-label`, "yb-grid-option-label");
            label.innerHTML = `${this_option.action} ${key}`;
            

            let option = yb_createElement('div', 
            `'card-option-${lowkey}`, 
            'yb-single-line-input'
            );

            option.setAttribute(
                "style", 
                "margin-left: auto; margin-right: auto; text-align: center; background-color: rgba(50,50,50,0.4); line-height: 1.8; height: 32px;"
            );
            option.setAttribute('data-action', `${lowaction}_${lowkey}`);

            option.innerHTML = key;
            

            if (key==='Cancel') {
                option.style.color = 'red';
                option.style.borderColor = 'red';
                option.addEventListener('click', function() {
                    yb_hide_quarter_card();
                    
                });
            } else {
                option.addEventListener('click', function() {
                    yb_handle_quarter_card_option(options[key].function)
                });
            }

            v_option_container.appendChild(option);


        }
    }

    card_options.appendChild(h_option_container);
    card_options.appendChild(v_option_container);

    card.appendChild(card_options);
    
    document.body.appendChild(card);

}