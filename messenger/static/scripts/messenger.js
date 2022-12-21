$('#send-button').click(function() {
    let input = document.getElementById("message-field").value;
    let username = $(this).attr('data-username');
    let conversation_id = $(this).attr('data-id');
    console.log(username)
    console.log(conversation_id)
    let cookie = document.cookie;
    let csrfToken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    console.log(csrfToken);
    $.ajax(
        {
            type:"POST",
            headers: {
                'X-CSRFToken': csrfToken
              },
            url: "/messages/send/",
            data: {
                receiver: username,
                conversation: conversation_id,
                body: input,
            },
            success: function(data){
                let message = data
                let user_name = message.user_name
                let body = message.body
                let created_at = message.created_at

                $('#message-container').prepend(
                    `
                    <div class='message-wrapper'>
                        <div class='message-bubble-right'>
                            <p class='message-text-content'>${body}</p>
                        </div>
                        <p><small>${created_at}</small></p>
                    </div>
                    `

                )
                       
            }
        }

        
    )

})