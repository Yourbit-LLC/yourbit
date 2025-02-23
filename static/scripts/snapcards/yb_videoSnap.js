function yb_handlePrevious(){

}

function yb_handlePlay(){
    if (this_button.name === "play"){
        this_button.name = "pause";
        this_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path d="M615-200q-24.75 0-42.375-17.625T555-260v-440q0-24.75 17.625-42.375T615-760h55q24.75 0 42.375 17.625T730-700v440q0 24.75-17.625 42.375T670-200h-55Zm-325 0q-24.75 0-42.375-17.625T230-260v-440q0-24.75 17.625-42.375T290-760h55q24.75 0 42.375 17.625T405-700v440q0 24.75-17.625 42.375T345-200h-55Z"/></svg>`;
    } else {
        this_button.name = "play";
        this_button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32"><path style="fill:white;" d="M366-232q-15 10-30.5 1T320-258v-450q0-18 15.5-27t30.5 1l354 226q14 9 14 25t-14 25L366-232Z"/></svg>`;
    }
}

function yb_handleNext(){

}

let player_button = document.querySelectorAll(".yb-playerButton");
for (let i = 0; i < player_button.length; i++){

    let this_button = player_button[i];
    
    if (this_button === "play" || this_button === "pause"){
        this_button.addEventListener("click", yb_handlePlay);
    } else if (this_button === "next"){
        this_button.addEventListener("click", yb_handleNext);
    } else if (this_button === "previous"){
        this_button.addEventListener("click", yb_handlePrevious);
    }
}