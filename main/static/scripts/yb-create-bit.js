/*
    Universal Create Bit Functions
*/

/* Publish bit button listener mobile */
$('#mobile-publish-bit').click(function() {
    let action = $(this).attr("name")
    
    if (action === "publish") {
        let type = document.getElementById('bit-type-hidden-field').value;
        let private_toggle = document.getElementsByName("toggle-private")[1];
        console.log(private_toggle)
        let public_toggle = document.getElementsByName("toggle-public");
        gatherMobileBit(type, yb_submitBit);
    } else {
        let type = document.getElementById('bit-type-hidden-field').value;
        let private_toggle = document.getElementsByName("toggle-private")[1];
        console.log(private_toggle)
        let public_toggle = document.getElementsByName("toggle-public");
        gatherMobileBit(type, yb_editBit);
        
    }
});

$("#mobile-title").click(function(){
    console.log("clicked")
})

//Collect information from form fields
function gatherMobileBit(type, callback) {
    //Create form data for new bit
    let new_bit = {};
    var is_valid = true; /*Is valid verifies if forms are complete, initial value = true */ 
    console.log("gather_bit_step1")
    //Compile information from fields to append to new_bit
    let title_field = document.getElementById('mobile-title');
    let body_field = document.getElementById("mobile-body");
    new_bit.type = type;
    
    /*Check bit type in order to properly validate form and transmit data */
    if (type === 'chat') {

        /*Get title*/
        let title = title_field.value;
        /*Check if there is a title and append data to new_bit */
        if (title.length > 0) {
            new_bit.title = title
        } else {
            new_bit.title= "yb-no-title"
        }

        /*Get body and append it to new_bit */
        let body = body_field.value;
        if (body.length > 0) {
            new_bit.body =  body
        } else {
            is_valid = false;
            body_field.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            body_field.attr('placeholder') = 'Must Enter a body';
        }

    }
    
    if (type === 'photo') {
        console.log("gather_bit_step2");
        /*Get title and append it to new_bit*/
        let title = title_field.value;
        new_bit.title = title

        if (title.length > 0) {
            new_bit.title = title;
        } else {
            is_valid = false;
            body_field.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            body_field.attr('placeholder') = 'Must Enter a Title';
        }

        /*Get body and append it to new_bit*/
        let body = body_field.value;
        
        if (body.length > 0) {
            new_bit.body = body;
        } else {
            new_bit.body = "yb-no-body";
        }
        /*Get image and append it to new_bit*/
        let img = $('#mobile-file-field')[0].files[0];

        new_bit.photo = img


    }

    if (type === 'video') {
            /*Get title and append it to new_bit*/
            let title = document.getElementById("mobile-title");
            new_bit.title = title
            /*Get body and append it to new_bit*/
            let body = document.getElementById("mobile-body");
            new_bit.body = body
            /*Get video and append it to new_bit*/
            let vid = $('#mobile-file-field')[0].files[0];
            new_bit.video = vid
    } 

    if (is_valid === true) {
        console.log(new_bit)
        callback(new_bit);
    }
}


//AJAX call to submit bit
function yb_submitBit(this_bit) {
    console.log("gather_bit_step3");
    //Get CSRF token
    let csrfToken = getCSRF();
    console.log(this_bit)
    //Get base url
    let base_url = window.location.origin;
    let url = `${base_url}/profile/publish/`
    let scope = document.getElementById('bit-scope-hidden-field').value;
    let this_data = new FormData();
    this_data.append('type', this_bit.type);
    this_data.append('title', this_bit.title);
    this_data.append('body', this_bit.body);
    this_data.append('scope', scope);
    
    if (this_bit.type === 'photo') {
        this_data.append('photo', this_bit.photo);
    }
    if (this_bit.type === 'video') {
        this_data.append('video', this_bit.video);
    }

    $.ajax(
        {

            type:'POST',            
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken':csrfToken,
            },
            url: url,
            data: this_data,
            
            success: function(response) {

                //Data is blueprint for bit
                let blueprint = response;
                let bit_container = document.getElementById('bit-container');
                let end_bit = getLenBitIndex();
                let first_bit_id = yb_getBitOnScreen(1);
                first_bit_id = first_bit_id.substring(1);
                console.log(first_bit_id)
                let first_bit = document.getElementById(first_bit_id)
                //Clear and hide form
                clearBitForm();
                dropCreateBit(hideCreateBit);

                //Pass blueprint to bit builder to generate new bit
                let new_bit = BuildBit(blueprint);

                //Prepend new bit to bit container, in future change to append before next sibling for dynachron.
                bit_container.insertBefore(new_bit.built_bit, first_bit);
                // Add the animation class to the element after a short delay
                setTimeout(() => {
                    new_bit.built_bit.classList.add('animate');
                    }, 100);
                yb_getDisplay();

            }   
        }   
    )

    
}

function clearBitForm() {
    if (width < 700) {
        $('#mobile-title').val('');
        $('#mobile-body').val('');
    }
}