/* Publish bit event listener mobile */
$('#mobile-publish-bit').click(function() {
    let type = document.getElementById('bit-type-hidden-field').value;
    let option = document.getElementById('create-option-hidden-field').value;
    console.log('clicked')
    if (option === 'bit') {
        //gatherMobileBit compiles all of the form fields into Form new bit, submitBit houses the ajax function
        gatherMobileBit(type, submitBit);
    }
    if (option === 'community') {
        //createCommunity compiles all of the form fields into new_community, initialize community houses the ajax
        //and redirect functions
        createCommunity(initializeCommunity)
    }
    if (option === 'message') {
        createMessage(sendMessage)

    }

});

function createMessage(callback) {
    //Create form data new message
    let new_message = new FormData();

    //Get information from create fields
    let to_user = document.getElementById('mobile-to');
    let body = document.getElementById('body');

    //append fields to new_message
    new_message.append('to_user', to_user);
    new_message.append('body', body);

    clearField('#mobile-to');
    clearField('#body');

    //Submit new message to backend with ajax function sendMessage()
    callback(new_message);
}

function sendMessage(new_message) {
    let csrfToken = getCSRF();
    let base_url = window.location.origin;
    $.ajax(
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: `${base_url}/messages/send/`,
            data: new_message,
            success: function(handle){
                
            }
        }
    )
}

function clearField(field) {
    if (width < 700) {
        $(field).val('');
    }
}
