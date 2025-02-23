var bit_options_fields = {
    "is_comments": document.getElementById("enable-comments"),
    "is_shareable": document.getElementById("enable-sharing"),
    "is_feedback": document.getElementById("enable-feedback"),
}

for (var key in bit_options_fields) {
    bit_options_fields[key].addEventListener("change", function() {
        console.log(key + ' changed')
        if (this.checked) {
            bitBuilder.field[key].checked = true;
        } else {
            bitBuilder.field[key].checked = false;
        }
    });
}