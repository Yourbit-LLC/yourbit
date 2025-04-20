
/* 
    Variables are defined under try/catch statements as a failsafe for when garbage 
    collection fails to run properly when leaving a subpage. In some cases, when initializing 
    a variable, the browser would say the variable was already defined. This is a workaround 
    for that.
*/

    try {
        var video = document.getElementById("yb-video-player");
        var comment_container = document.getElementById("player-comments");
        var videoContainer = document.getElementById("yb-player");
        var about_section = document.getElementById("video-about-header");
        var description = document.getElementById("yb-player-description");
        var send_comment = comment_container.querySelector(".yb-send-comment");
        var countdown_container = document.getElementById("countdown-container");
        var timerInterval;
        var countdownTime = 5;
    } catch {
        video = document.getElementById("yb-video-player");
        comment_container = document.getElementById("player-comments");
        countdown_container = document.getElementById("countdown-container");
        videoContainer = document.getElementById("yb-player");
        about_section = document.getElementById("video-about-header");
        description = document.getElementById("yb-player-description");
        send_comment = comment_container.querySelector(".yb-send-comment");
        countdownTime = 5;
    }

    // Function to update the countdown every second
    function updateVideoCountdown() {
        const countdownElement = document.getElementById('countdown');

        // Update the text content to show the current countdown time
        countdownElement.innerText = countdownTime;

        // Check if the countdown is over
        if (countdownTime > 0) {
            countdownTime--; // Decrease the countdown by 1
        } else {
            clearInterval(timerInterval); // Stop the countdown when it reaches 0
            yb_getNextVideo();
        }
    }

    function startVideoCountdown() {
        video.style.setProperty('--controls-backdrop-color', video.getAttribute('primary-color'));
        timerInterval = setInterval(updateVideoCountdown, 1000, countdownTime);

    }

    function cancelCountdown() {
        clearInterval(timerInterval);
        countdown_container.style.display = "none";
        countdownTime = 5;
        video.style.setProperty('--controls-backdrop-color', "transparent");

    }

    $(document).ready(function(){

        send_comment.addEventListener("click", yb_pressSendComment);
        
        //Iterate through bits in video json to use in rendering the up next qeueue
        for (var i = 0; i < VIDEO_QUEUE.length; i++) {
            var bit = VIDEO_QUEUE[i];
            var this_video = bit.video_upload;
            var videoElement = yb_createElement("div", "yb-container-video-listItem", "yb-video-list-item-" + i);
            videoElement.setAttribute("data-id", this_video.id);
            
            if (video.thumbnail.storage_type == "yb") {
                var thumbnail = this_video.thumbnail.image;
            } else {
                var thumbnail = this_video.thumbnail.ext_url;
            }

            videoElement.innerHTML = `
                <div class="yb-container-thumbnail-listItem">
                    <img style="width:100%;" src='${thumbnail}' alt='Thumbnail'>
                </div>
                <div class="yb-container-videoInfo-listItem">
                    <h4>${video.title}</h4>
                    <div class="yb-flexRow">
                        <p class="yb-font-autoGray"><small>${bit.profile.username}</small></p>
                        <p class="yb-font-autoGray"><small>${bit.watch_count}</small></p>
                    </div>
                </div>
            `;

            videoElement.addEventListener("click", function() {
                cancelCountdown();
                yb_getNextVideo(this.videoId);
            });
            document.getElementById("yb-up-next").appendChild(videoElement);
        }
    });

    $(video).ready(function() {
        video.play();

        video.addEventListener('ended', function() {
            // Action to take when the video ends
            if (VIDEO_QUEUE.length > 0) {
                countdown_container.style.display = "block";
                startVideoCountdown();
            } else {
                console.log("No more videos in queue")
            }
        });

        video.addEventListener('play', function() {
            // Action to take when the video is played
            cancelCountdown();
        });

           

        about_section.addEventListener("click", function(){
            console.log("clicked")
            let about_state = about_section.getAttribute("data-state")
            if (about_state == "closed") {
                about_section.setAttribute("data-state", "open");
                description.style.display = "block";

                var parent = about_section.parentElement; // Adjust this if your element is nested deeper
                var rect = about_section.getBoundingClientRect();
                var parentRect = parent.getBoundingClientRect();
                
                // Calculate the offset to scroll
                var offsetTop = rect.top - parentRect.top + parent.scrollTop;
                
                parent.scrollTo({
                    top: offsetTop,
                    behavior: "smooth"
                });
            } else {
                console.log("About state open")
                about_section.setAttribute("data-state", "closed");
                description.style.display = "none";

            }
        })


        
        console.log('The video is now playing!');



    })