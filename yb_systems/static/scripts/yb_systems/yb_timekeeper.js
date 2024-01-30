/* 
    Timekeeping functions keep track of time for visual previews 
    and various timekeeping operations 
*/
const TIME_KEEPER = document.getElementById("time-keeper-node");
var clock_isTicking = false;


function yb_setTimezone(){
    let csrfToken = getCSRF();
    let user_tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    let url = `/systems/update/timezone/`
    fetch(url,
        {
            method: "POST",
            headers: {
                'Content-type' : 'application/json',
                'X-CSRFToken' : csrfToken
            },
            body: JSON.stringify({"user_tz":user_tz})
            
        })
    .then((resp) => resp.json())
    .then(function(data){
        console.log(data)
    });

    console.log(user_tz)
}

function yb_timeConvert(hours){
    //get am or pm
    let abbreviation = "AM";

    if (hours > 12) {
        hours = hours - 12;
        abbreviation = "PM";
    } else if (hours == 12) {
        abbreviation = "PM";
    } else if (hours == 0) {
        hours = 12;
    }
    return [hours, abbreviation];
}

var time_step = 0;

function yb_getTimeString(type){
    let now = new Date();
    let month = now.getMonth().toString().padStart(2, '0');
    let day = now.getDate().toString().padStart(2, '0');
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');

    let timeString = ""

    

    if (type === "decorated-time"){ 
        let converted_hours = yb_timeConvert(hours);
        if (time_step === 0){
            time_step = 1;
            timeString = `@${converted_hours[0]}:${minutes} ${converted_hours[1]}`;
        } else {
            time_step = 0;
            timeString = `@${converted_hours[0]} ${minutes} ${converted_hours[1]}`;
        }

        

    } else if (type === "time"){

        timeString = `${hours}:${minutes}`;

    } else if (type==="raw-date"){
        timeString = {
            "month": month,
            "day": day,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        }
    
    } else {
        console.log("Error: Invalid time type");
    }

    return timeString;
}

// Variable to store the interval ID
let clockInterval;

// Function to update the time on a timekeeping element
function yb_updateClock(clock_element_id, type) {
    // get current time

    let timeString = yb_getTimeString(type);
    if (type === "raw-date") {
        TIME_KEEPER_NODE.setAttribute("data-month", timeString.month);
        TIME_KEEPER_NODE.setAttribute("data-day", timeString.day);
        TIME_KEEPER_NODE.setAttribute("data-hours", timeString.hours);
        TIME_KEEPER_NODE.setAttribute("data-minutes", timeString.minutes);
        TIME_KEEPER_NODE.setAttribute("data-seconds", timeString.seconds);

    } else {
        try {
            let clock = document.getElementById(clock_element_id);
            clock.textContent = timeString;
        } catch (error) {
            console.log("stopClock()");
            clearInterval(clockInterval); // Use the correct interval ID
        }
    }
}

// Function to start the clock on a timekeeping element
function yb_startClock(clock_element_id) {
    // Initial call to display the time immediately
    yb_updateClock(clock_element_id, "decorated-time");

    // Update the clock every second (1000 milliseconds)
    clockInterval = setInterval(yb_updateClock, 1000, clock_element_id, "decorated-time");
}

// Function to stop the clock
function yb_stopClock() {
    clearInterval(clockInterval);
}

//Time since function to be ran on timestamp received from objects in the database
function yb_formatTimeAgo(timestamp) {
    const currentTime = new Date().getTime();
    const postTime = new Date(timestamp).getTime();
    const timeDifference = currentTime - postTime;
    const minutes = Math.floor(timeDifference / 60000); // 1 minute = 60000 milliseconds
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
        return "Just now";
    } else if (minutes < 60) {
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (days <= 7) {
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
        // After 7 days, display the full date and time
        return new Date(timestamp).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    }
}


// Get a reference to the DOM element where you want to display the timer
var timer = 0;

let startTime; // Timestamp when the timer started

function yb_updateTimer(timestamp) {
  if (!startTime) {
    startTime = timestamp;
  }

  let elapsedTime = timestamp - startTime;

  // Calculate the time in seconds
  let seconds = Math.floor(elapsedTime / 1000);

  // Update the timer element with the elapsed time
  timer = seconds;

  // Request the next animation frame
  setInterval(updateTimer, 1000, timestamp);
}

function yb_startTimer() {
    let timestamp = new Date();
    // Start the timer by requesting the first animation frame
    updateTimer(timestamp);
}

// Start the timer by requesting the first animation frame

