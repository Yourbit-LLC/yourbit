/*
    Universal Create Bit Functions
*/

/* Publish bit button listener mobile */
$('#mobile-publish-bit').click(function() {
    let type = document.getElementById('bit-type-hidden-field').value;
    
    gatherMobileBit(type, submitBit);
});

$("#mobile-title").click(function(){
    console.log("clicked")
})


function gatherMobileBit(type, callback) {
    //Create form data for new bit
    let new_bit = {};
    var is_valid = true; /*Is valid verifies if forms are complete, initial value = true */ 
    
    //Compile information from fields to append to new_bit
    let title_field = document.getElementById('mobile-title');
    let body_field = document.getElementById("mobile-body");
    new_bit.type = type
    
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
        let summary = body_field.value;
        
        if (summary.length > 0) {
            new_bit.summary = summary;
        } else {
            new_bit.summary = "yb-no-summary";
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
        callback(new_bit);
    }
}


function clearBitForm() {
    if (width < 700) {
        $('#mobile-title').val('');
        $('#mobile-body').val('');
    }
}