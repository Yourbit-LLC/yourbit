/*

    Video player progress

*/

myVideo.addEventListener("timeupdate", function() {
    // if the video is loaded and duration is known
    if(!isNaN(this.duration)) {
         var percent_complete = this.currentTime / this.duration;
         // use percent_complete to draw a progress bar
     }
 });