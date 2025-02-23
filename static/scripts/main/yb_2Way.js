const LOADING_SCREENS = document.querySelectorAll('.tw-loading-iconContainer');

function tw_hideLoading() {
    
    LOADING_SCREENS.forEach(function(screen){
        screen.classList.add('hide');
    });
}

function tw_showLoading() {
    
    LOADING_SCREENS.forEach(function(screen){
        screen.classList.remove('hide');
    });
}