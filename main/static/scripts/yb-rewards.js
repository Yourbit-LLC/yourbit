var base_url = window.location.origin;



$('#back-to-home').click(function() {
    window.location.href = `${base_url}/social/home`
});

$('#learn-button').click(function() {
    displayBubble(growBubble);
});

function displayBubble(callback) {
    $('#learn-bubble').show();
    callback();
}

function growBubble() {
    $('#learn-bubble').animate({height: "90vh", width: "95vw"}, "fast");
    $('#rewards-bubble-text').fadeIn("slow");
}

