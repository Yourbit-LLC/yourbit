var bit_options_fields = {
    "is_comments": document.getElementById("enable_comments"),
    "is_shareable": document.getElementById("enable_sharing"),
    "is_feedback": document.getElementById("enable_feedback"),
}

for (var key in bit_options_fields) {
    bit_options_fields[key].addEventListener("change", function() {
        if (this.checked) {
            bitBuilder.field[key].checked = true;
        } else {
            bitBuilder.field[key].checked = false;
        }
    });
}