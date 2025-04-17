var bit_monetize_fields = {
    "is_donations": document.getElementById("mb-field-isDonations"),
    "has_ads": document.getElementById("mb-field-hasAds"),
    
}

$(document).ready(function() {
    for (var key in bit_monetize_fields) {
        bit_monetize_fields[key].addEventListener("change", function() {
           bitBuilder.field[key].value = this.value;
        });
    }
    console.log("Bit Monetize Loaded Successfully")
})
