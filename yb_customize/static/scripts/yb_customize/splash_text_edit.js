var text_color_input = document.getElementById('text-font-color-picker');
var text_color_button = document.getElementById('text-font-color-circle');
var title_color_input = document.getElementById('title-font-color-picker');
var title_color_button = document.getElementById('title-font-color-circle');
var title_font_size_input = document.getElementById('title-font-size-slider');
var text_font_size_input = document.getElementById('text-font-size-slider');

text_color_input.addEventListener('input', function() {
    text_color_button.style.backgroundColor = text_color_input.value;
    yb_recolorSplashText(text_color_input.value);
});

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

