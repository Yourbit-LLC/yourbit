var button_color_trigger = document.getElementById("button-color-circle");
var button_text_color_trigger = document.getElementById("button-text-color-circle");
var button_color_input = document.getElementById("button-color-picker");
var button_text_color_input = document.getElementById("button-text-color-picker");


var shape_radios = document.getElementsByClassName("button-shape-radio");
var square_button_check = document.getElementById("squared-button");
var rounded_button_check = document.getElementById("rounded-button");

var button_text_size_input = document.getElementById("button-text-size");

$(document).ready(function() {
    for (var i = 0; i < shape_radios.length; i++) {
        console.log("button-change")
        shape_radios[i].addEventListener("change", function() {
            var value = this.value;
            console.log("button-change")
            yb_changeButtonShape(value);
        });
    }

    button_color_trigger.addEventListener("click", function() {
        button_color_input.click();
    });

    button_text_color_trigger.addEventListener("click", function() {
        button_text_color_input.click();
    });

    button_color_input.addEventListener("input", function() {
        var value = this.value;
        yb_recolorSplashButton(value);
    });

    button_text_color_input.addEventListener("input", function() {
        var value = this.value;
        yb_recolorSplashButtonText(value);
    });

    button_color_input.addEventListener("change", function() {  
        yb_pushToHistory('button-color', this.value);
    });

    button_text_color_input.addEventListener("change", function() {
        yb_pushToHistory('button-text-color', this.value);
    });
});
