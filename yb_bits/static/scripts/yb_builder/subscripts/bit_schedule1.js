/*

    Name: 
    bit_schedule.js

    File Location:
    yb_bits/static/scripts/yb_builder/subscripts/bit_schedule.js

    Description: 
    This script is used to handle the bit schedule fields in the bit builder. It listens for changes in the
    scheduled bit fields and updates the corresponding bit builder object. The script is designed to be used with Yourbit's 
    bit builder Web Deployment.


    Tips for modifying this script:

        -All scheduled bit fields are prefixed with "sb-" to indicate they are a scheduled bit subfield.

        -The fields follow Yourbits standard naming convention of form fields:
            [form-identifier]-field-[fieldName]

        -The actual field name is always camel cased and should match the element name, as well as, the field key 
        in the bit builder object.

        -There should never be 2 instances of the bit scheduler or other create bit subpages at a time. The 
        "sb-" and "bb-" prefixes are used to diferentiate sub-page fields and master form fields. 

        -If a field is added to then bit scheduler, registering it in the bit_schedule_fields object will
        allow it to automatically be identified by the appropriate event listener.

        -Any fields registered here must also have a bitBuilder master field and a reference key to the master field 
        in the bit builder object. Look for the variable "builderFields" in the yb_bits/scripts/yb_builder/yb_createBit.js 
        file.

*/


var bit_schedule_fields = {
    "is_scheduled": document.getElementById("sb-field-isScheduled"),
    "scheduled_date": document.getElementById("sb-field-scheduleDate"),
    "scheduled_time": document.getElementById("sb-field-scheduleTime"),
    "evaporate": document.getElementById("sb-field-deletePreference"),
    "evaporation_date": document.getElementById("sb-field-expirationDate"),
    "evaporation_time": document.getElementById("sb-field-expirationTime"),
}

$(document).ready(function() {
    try {
        for (var key in bit_schedule_fields) {
            bit_schedule_fields[key].addEventListener("change", function() {
            builderFields[key].value = this.value;
            console.log(key + ' changed')
            });
        }

        console.log("Bit Schedule Loaded Successfully")

    } catch (error) {
        console.error("Error initializing bit schedule fields: ", error);
    }
    
});