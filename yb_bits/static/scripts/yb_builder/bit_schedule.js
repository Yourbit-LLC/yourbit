var bit_schedule_fields = {
    "is_scheduled": document.getElementById("is_scheduled"),
    "schedule_date": document.getElementById("schedule_date"),
    "schedule_time": document.getElementById("schedule_time"),
    "has_expiration": document.getElementById("has_expiration"),
    "expiration_date": document.getElementById("expiration_date"),
    "expiration_time": document.getElementById("expiration_time"),
    
    
}

for (var key in bit_schedule_fields) {
    bit_schedule_fields[key].addEventListener("change", function() {
       bitBuilder.field[key].value = this.value;
    });
}