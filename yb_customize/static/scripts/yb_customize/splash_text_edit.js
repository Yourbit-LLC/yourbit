color_inputs = document.getElementsByClassName("font-color-input");
var text_color_input = document.getElementById('username-font-color-picker');
var text_color_button = document.getElementById('username-font-color-circle');
var title_color_input = document.getElementById('name-font-color-picker');
var title_color_button = document.getElementById('name-font-color-circle');
var title_font_size_input = document.getElementById('title-font-size-slider');
var text_font_size_input = document.getElementById('text-font-size-slider');


function yb_blurSplashInputs(e) {
    let this_input = e.currentTarget;
    let this_value = this_input.value;
    let this_name = this_input.getAttribute("name");

    yb_pushToHistory(this_name, this_value);
}

for (let i = 0; i < color_inputs.length; i++) {
    color_inputs[i].addEventListener('change', yb_blurSplashInputs);
}

text_color_input.addEventListener('input', function() {
    text_color_button.style.backgroundColor = text_color_input.value;
    yb_recolorSplashText(text_color_input.value);
});

text_color_input.addEventListener('blur', yb_blurSplashInputs);

title_color_input.addEventListener('input', function() {
    title_color_button.style.backgroundColor = title_color_input.value;
    yb_recolorSplashTitle(title_color_input.value);
});

title_font_size_input.addEventListener('input', function() {
    yb_resizeSplashTitle(title_font_size_input.value);
});

text_font_size_input.addEventListener('input', function() {
    yb_resizeSplashText(text_font_size_input.value);
});

text_color_button.addEventListener('click', function() {
    text_color_input.click();
});

title_color_button.addEventListener('click', function() {
    title_color_input.click();
});

