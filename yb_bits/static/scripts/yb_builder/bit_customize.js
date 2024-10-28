var bit_monetize_fields = {
    "is_donations": document.getElementById("is_donations"),
    "has_ads": document.getElementById("has_ads"),
    
}

for (var key in bit_monetize_fields) {
    bit_monetize_fields[key].addEventListener("change", function() {
       bitBuilder.field[key].value = this.value;
    });
}