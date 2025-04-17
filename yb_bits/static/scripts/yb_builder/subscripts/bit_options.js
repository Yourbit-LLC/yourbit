/*

    Tips for modifying this script:

        -All scheduled bit fields are prefixed with "sb-" to indicate they are a scheduled bit subfield.

        -The fields follow Yourbits standard naming convention of form fields:
            [form-identifier]-field-[fieldName]

        -The actual field name is always camel cased and should match the element name, as well as, the field key 
        in the bit builder object.

        -There should never be 2 instances of the bit scheduler or other create bit subpages at a time. The 
        "ob-" and "bb-" prefixes are used to diferentiate sub-page fields and master form fields. 

*/

var bit_options_fields = {
    "is_comments": document.getElementById("ob-field-isComments"),
    "is_shareable": document.getElementById("ob-field-isShareable"),
    "is_feedback": document.getElementById("ob-field-isFeedback"),
}


$(document).ready(function() {
    try {
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
        console.log("Bit Options Loaded Successfully")
        
    } catch (error) {
        console.error("Error initializing bit options fields: ", error);
    }
    
});