/*

        yb_sessions.js
        Dated: 11/8/2022
        Updated: 11/8/2022
        Yourbit, LLC



        Tasks on yourbit are actions the user has taken in the current session.

        On redirect from the page tasks are saved in the database under the session table
        The following tasks include
            -#home-task
            -#video-task
            -#comment-task
            -#message-task
            -#profile-task
        
*/


//Tasks is the list that represents active tasks in the task manager
var tasks = []

//Stores ids for videos in video task
var videos = []

//Stores the id for the last video task
var last_video = ""

//Stores ids for bits in comment tasks
var comments = []

//Stores ids for conversations in conversation tasks
var conversations = []

//Stores ids for profiles in profile tasks
var profiles = []

//Stores ids for communities in community tasks
var communities = []

var active_home_task = false;
var active_video_task = false;
var active_profile_task = false;
var active_message_task = false;
var active_comment_task = false;
var active_notification_task = false;
var back_button_active = false;

var fullscreen_view = false;

const VIDEO_QUEUE = []

function getCSRF() {
    let csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    return csrf_token;
}

function yb_syncState() {
    $.ajax(
        {
            type: 'POST',
            contentType: false,
            // The following is necessary so jQuery won't try to convert the object into a string
            processData: false,
            headers: {
                'X-CSRFToken': csrfToken
            },
            url: url,
            data: data,

            success: function(data) {
                //Get tasks
                let is_tasks = data.is_tasks
                let is_home_task = data.home_task;
                let is_comment_task = data.is_comment_task;
                let is_message_task = data.message_task;
                let is_profile_task = data.is_profile_task;
                let is_video_task = data.is_video_task;

                //For task if task = task append task
                if (is_tasks === true){
                    if (is_home_task === true){
                        tasks.push("#home-task");
                    }
                    if (is_comment_task === true){
                        tasks.push("#comment-task");
                        let recent_comment = data.recent_comment
                        for (var bit in recent_comment) {
                            comments.push(bit.id);
                        }
                    }
                    if (is_profile_task === true) {
                        tasks.push("#profile-task");
                        let recent_profile = data.recent_profile;
                        for (var profile in recent_profile){
                            profiles.push(profile.id);
                        }
                    }
                    if (is_message_task === true) {
                        tasks.push("#message-task");
                        let conversations = data.conversations;
                        for (var conversation in conversations){
                            conversations.push(conversation.id);
                        }
                    } 
                    if (is_video_task === true) {
                        tasks.push("#video-task");
                        for (var video in data.video){
                            videos.push(video.id);
                        }
                    }
                }

            }
        }
    )
}

function yb_checkPage(){
    let current_page = yb_getSessionValues("location");
    if (current_page === "home"){
        return "#home-task"
    }
    else if (current_page === "profile"){
        return "#profile-task"
    } else if (current_page === "messages"){
        return "#message-task"
    } else {
        console.log("no relevant page change");
    }
}

//Start task function initiates a new task in the task manager
function yb_startTask(task) {
    
    //Check if task is not already in the task list
    if (tasks.includes(task) === false) {
    
        if (task === "#home-task")  {

            tasks.push(task)
        }
        //Ran on play of a video
        if (task === "#video-task") {
            tasks.push(task);
            
        }
        //Ran on creation of comment
        if (task === "#comment-task") {

            tasks.push(task);
            
        }
        //Ran on message send
        if (task === "#message-task") {
            tasks.push(task);

            
        }
        //Ran on user profile visitation
        if (task === "#profile-task") {
            tasks.push(task);
            
        }
        //Ran on community visitation
        if (task === "#community-task") {
            tasks.push(task);
        }

    }
}

//Ran when user closes a task
function yb_endTask(task) {
    //find task
    let index = tasks.indexOf(task);

    tasks.splice(index);
    if (task === '#home-task') {

        $('#home-task').animate({'height':'0px', 'width': '0px'}, 'slow')
        setTimeout(function(){
            $('#home-task').remove();
        }, 500)
        
    }

    if (task === '#video-task') {
        for (let i = 0; i < videos.length; i++) {
            videos.pop();
        }
    }

    if (task === '#comment-task') {
        for (let i = 0; i < comments.length; i++) {
            comments.pop();
          }
    }

    if (task === '#message-task') {
        for (let i = 0; i < conversations.length; i++) {
            conversations.pop();
        }
        $('#message-task').animate({'height':'0px', 'width': '0px'}, 'slow')
        setTimeout(function(){
            $('#message-task').css('display', 'none')
        }, 500)
    }

    if (task === '#profile-task') {
        for (let i = 0; i < profiles.length; i++) {
            profiles.pop();
        }
    }

    if (task === '#community-task') {
        for (let i = 0; i < videos.length; i++) {
            communities.pop();
          }
    }
}

function yb_startSubTask(subtask, object) {
    if (subtask === 'video'){
        videos.push(object);
    }

    if (subtask === 'comment'){
        comments.push(object);
    }
    if (subtask === 'message'){
        conversations.push(object);
    }
    if (subtask === 'profile'){
        profiles.push(object);
    }
    if (subtask === 'community'){
        communities.push(object);
    }

}


//Stop tasks within the task widget such as individual conversations, comments, videos, profiles, and communties
function yb_stopSubTask(subtask, object) {
    if (subtask === 'video'){
        let index = videos.indexOf(object);

        videos.splice(index);
    }

    if (subtask === 'comment'){
        let index = videos.indexOf(object);

        comments.splice(index);
    }
    if (subtask === 'message'){
        let index = videos.indexOf(object);

        comments.splice(index);
    }
    if (subtask === 'profile'){
        let index = videos.indexOf(object);

        comments.splice(index);
    }
    if (subtask === 'community'){
        let index = videos.indexOf(object);

        comments.splice(index);
    }

}

function yb_getRunningTasks() {
    return tasks
}

function yb_getSubTasks(task) {
    if (task === 'video') {
        return videos
    }

    if (task === 'comment') {
        return comments
    }
    if (task === 'profile') {
        return profiles
    }
    if (task === 'community') {
        return communities
    }
}
/*
    
    Get and set loaded functions allow other front end functions to communicate with eachother as to whether
    they are initializing or updating. 
*/

//Loaded set to false by default
var loaded = false;

//Get loaded returns value
function yb_getLoaded() {
    return loaded;
}

//Set loaded changes the loaded value to true. Loaded is only false on initialization
function yb_setLoaded(bool){
    loaded = bool;
}

/*

    Get session values retrieves and returns information from backend context.

*/

var first_space = true; //Used to track first load for animation purposes

function yb_getSessionValues(key) {
    
    let value = $("#session_values").attr(`data-${key}`);
    return value
}

function yb_setSessionValues(key, value) {
    $("#session_values").attr(`data-${key}`, value);
}


function yb_activateFullscreen() {
    yb_setSessionValues("fullscreen", "true");
}

function yb_deactivateFullscreen() {
    yb_setSessionValues("fullscreen", "false");
}

function yb_updatePageTask(next_location) {
    let this_location = yb_getSessionValues("location");
    
    console.log("update tasks ran at: " + this_location)
    
    if (this_location === "home") {
        console.log("conditional said home = true")
        yb_startTask("#home-task");
    }

    if (this_location === "profile") {
        if (active_profile_task) {
            let this_user = yb_getSessionValues("username");
            yb_startSubTask("profile", this_user)
        } else {
            let this_user = yb_getSessionValues("username");
            yb_startTask("#profile-task");
            yb_startSubTask("profile", this_user);
        }
    }

    if (this_location === "inbox") {
        console.log("current location: messages")
        if (next_location === "conversation"){
            //Add back button
            return "button"
        } else {
            console.log("starting task")
            yb_startTask("#message-task");
            /* 
                No subtasks are added because there is no conversation to 
                refer to.
            */
        }
    }

    if (this_location === "conversation") {
        let this_conversation = yb_getSessionValues("conversation");
        if (active_message_task) {
            if (conversations.length === 3){ 
                conversations.pop();
                yb_startSubTask("message", this_conversation);
            } else {
                yb_startSubTask("message", this_conversation);
            }
        } else {
            yb_startTask("#message-task");
            yb_startSubTask("message", this_conversation);
        }
    }

       

}
/*
    setTimeout(showMiniBar, 1200);
    setTimeout(showHomeTask, 1200);
    setTimeout(showMessageTask, 1400);
    setTimeout(showCommentTask, 1600);
    setTimeout(showProfileTask, 1800);
    setTimeout(showVideoTask, 2000);

*/


function yb_showMiniBar() {
    $('.minibar').fadeIn();
    yb_assembleTasks();
    
}
function yb_loadMessageWidget() {
    let container = document.querySelector(".mini-widget");
    let header = yb_createElement("div", "message-widget-header", "yb-widget-header");
    
    header.setAttribute("style","position: relative; width: 90%; margin-left: auto; margin-right: auto;")

    let header_text = yb_createElement("h3", "message-widget-header-text", "yb-widget-header-text");
    
    header_text.setAttribute("style", "margin-top: 10px; color: white; text-align: center;")
    header_text.innerHTML = " Recent Conversations";
    header.appendChild(header_text);

    let close_button = yb_createElement("button", "video-widget-close-button", "yb-button-close");
    close_button.setAttribute("style", "top: 0px;");
    header.appendChild(close_button);

    close_button.addEventListener("click", function() {
        yb_hideWidget();
    });

    container.appendChild(header);

    

    let list_container = yb_createElement("div", "message-list-container", "yb-widget-sub-container");
    
    container.appendChild(list_container);
    

    let button_container = yb_createElement("div", "message-button-container", "yb-widget-button-container");
    button_container.setAttribute("style", "position: relative; text-align:center; width: 90%; margin-left: auto; margin-right: auto;")
    container.appendChild(button_container);
    
    let messages_button = yb_createButton("go_to_messages", "go-to-messages", "yb-form-button", "Go to Messages");
    messages_button.setAttribute("style", "position: relative; text-align: center; margin-top: 10px; margin-bottom: 10px; width: 45%; margin-left: auto; margin-right: auto;");
    button_container.appendChild(messages_button);

    messages_button.addEventListener("click", function() {
        yb_hideWidget();
        messages_inbox_url();
    })

    yb_getConversations(list_container);
}

function yb_loadVideoWidget() {
    let container = document.querySelector(".mini-widget");
    let header = yb_createElement("div", "video-widget-header", "yb-widget-header");
    let header_text = yb_createElement("h3", "video-widget-header-text", "yb-widget-header-text");
    header_text.setAttribute("style", "margin-top: 10px; color: white; text-align: center;")
    header_text.innerHTML = " Recent Videos";

    let close_button = yb_createElement("button", "video-widget-close-button", "yb-button-close");
    header.appendChild(close_button);

    
    header.appendChild(header_text);
    container.appendChild(header);

    let list_container = yb_createElement("div", "video-list-container", "yb-widget-sub-container");
    container.appendChild(list_container);
    
    yb_getVideos(list_container);
}

function yb_loadProfileWidget() {
    let container = document.querySelector(".mini-widget");
    
    let header = yb_createElement("div", "profile-widget-header", "yb-widget-header");   
    header.setAttribute("style","position: relative; width: 90%; margin-left: auto; margin-right: auto;")

    let header_text = yb_createElement("h3", "profile-widget-header-text", "yb-widget-header-text");
    header_text.setAttribute("style", "margin-top: 10px; color: white; text-align: center;")
    header_text.innerHTML = " Recent Profiles";

    let close_button = yb_createElement("button", "video-widget-close-button", "yb-button-close");
    
    header.appendChild(close_button);
    close_button.addEventListener("click", function() {
        yb_hideWidget();
    });
    
    header.appendChild(header_text);
    container.appendChild(header);

    let list_container = yb_createElement("div", "profile-list-container", "yb-widget-sub-container");
    container.appendChild(list_container);
    
    these_tasks = yb_getSubTasks("profile");
    console.log(these_tasks);
}

// function yb_showWidget(type, callback) {
//     $('.mini-widget').fadeIn();
//     $("#content-container").css("filter", "blur(50px)");
//     $("#content-container").css("webkit-filter", "blur(50px)");


//     let mini_widget = document.querySelector(".mini-widget");

    
//     callback();
        



// }

function yb_hideWidget() {
    $('.mini-widget').html("");   
    $('.mini-widget').fadeOut();
    $("#content-container").css("filter", "blur(0px)");
    $("#content-container").css("webkit-filter", "blur(0px)");

}
function yb_assembleTasks() {

    //Get tasks from session manager
    tasks = yb_getRunningTasks();
    console.log(tasks)
    for (var task in tasks) {
        setTimeout(function() {
            let this_task = tasks[task];

            if (this_task === "#home-task") {
                console.log("home task found")
                showHomeTask();

            }
            if (this_task === "#message-task") {
                showMessageTask();

            }
            if (this_task === "#comment-task") {
                setTimeout(showCommentTask, 200);

            }
            if (this_task === "#profile-task") {
                setTimeout(showProfileTask, 200);
            }
            if (this_task === "#video-task") {
                setTimeout(showVideoTask, 800);
            }
        }, 300)
    }
}

function yb_showBackTask() {
    $('#back-task').show();
    $('#back-task').animate({'height':'40px', 'width': '40px'}, 'fast')
    document.getElementById("back-task").addEventListener("click", function() {
        $('#back-task').animate({'height':'40px', 'width': '40px'}, 'fast');
        setTimeout(function(){
            $('#back-task').css('display', 'none')
        }, 500)

        let this_location = yb_getSessionValues("location");
        if (this_location === "settings_privacy") {
            settings_url();
        }
        if (this_location === "settings_account") {
            settings_url();
        }
        if (this_location === "settings_notifications") {
            settings_url();
        }
        if (this_location === "settings_profile") {
            settings_url();
        }

        if (this_location === "customize") {
            settings_url();
        }  
        
    });
}

function yb_showMenuTask() {
    $('#menu-task').remove();
    let menu_task = yb_createElement("div", "menu-task", "task-icon");
    menu_task.innerHTML = '<svg class="task-icon-svg"  xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M120 816v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>';
    document.getElementById("minibar").appendChild(menu_task);
    
    menu_task.addEventListener("click", function() {
        yb_show_profile_menu();
    });
    
    $(menu_task).animate({'height':'40px', 'width': '40px'}, 'fast')
}

//Show Tasks

//Show Home Task
function showHomeTask() {
    $('#home-task').remove();
    let home_task = yb_createElement("div", "home-task", "task-icon");
    home_task.innerHTML = '<svg class="task-icon-svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M4 21V9l8-6 8 6v12h-6v-7h-4v7Z"/></svg>';
    document.getElementById("minibar").appendChild(home_task);
    
    home_task.addEventListener("click", function() {
        home_url();
        yb_endTask("#home-task");

    });
    
    $(home_task).animate({'height':'40px', 'width': '40px'}, 'fast')
}

//Show Message Task
function showMessageTask() {
    $('#message-task').remove();
    let message_task = yb_createElement("div", "message-task", "task-icon");
    message_task.innerHTML = '<svg class="task-icon-svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-7 8-5V6l-8 5-8-5v2Z"/></svg>';
    document.getElementById("minibar").appendChild(message_task);
    
                    
    message_task.addEventListener("click", function() {
        yb_showWidget("message", yb_loadMessageWidget);

    });

    $(message_task).animate({'height':'40px', 'width': '40px'}, 'fast')
}

//Show Comment Task
function showCommentTask() {
    $('#comment-task').remove();
    let comment_task = yb_createElement("div", "comment-task", "task-icon");
    comment_task.innerHTML = '<svg class="task-icon-svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M6 14h12v-2H6Zm0-3h12V9H6Zm0-3h12V6H6Zm16 14-4-4H4q-.825 0-1.412-.587Q2 16.825 2 16V4q0-.825.588-1.413Q3.175 2 4 2h16q.825 0 1.413.587Q22 3.175 22 4Z"/></svg>';
    document.getElementById("minibar").appendChild(comment_task);
    $(comment_task).animate({'height':'40px', 'width': '40px'}, 'fast')
}

//Show Profile Task
function showProfileTask() {
    $('#profile-task').remove();
    let profile_task = yb_createElement("div", "profile-task", "task-icon");
    profile_task.innerHTML = '<svg class="task-icon-svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 12q-1.65 0-2.825-1.175Q8 9.65 8 8q0-1.65 1.175-2.825Q10.35 4 12 4q1.65 0 2.825 1.175Q16 6.35 16 8q0 1.65-1.175 2.825Q13.65 12 12 12Zm-8 8v-2.8q0-.85.438-1.563.437-.712 1.162-1.087 1.55-.775 3.15-1.163Q10.35 13 12 13t3.25.387q1.6.388 3.15 1.163.725.375 1.162 1.087Q20 16.35 20 17.2V20Z"/></svg>';
    document.getElementById("minibar").appendChild(profile_task);
    
    profile_task.addEventListener("click", function() {
        yb_showWidget("profile", yb_loadProfileWidget);
    });
    
    $(profile_task).animate({'height':'40px', 'width': '40px'}, 'fast')
}

//Show Video Task
function showVideoTask() {
    $('#video-task').remove();
    let video_task = yb_createElement("div", "video-task", "task-icon");
    video_task.innerHTML = '<svg class="task-icon-svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M8 19V5l11 7Z"/></svg>';
    document.getElementById("minibar").appendChild(video_task);
    video_task.addEventListener("click", function() {
        yb_showWidget("video", yb_loadVideoWidget);
    });
    
    $(video_task).animate({'height':'40px', 'width': '40px'}, 'fast')
}



function showSpaceSplash(splash) {
    //Displays splash screens between spaces
    $(splash).fadeIn();
    $(splash).animate({'left':'0vw'});
}

function hideSplash() {
    //Hides the splash screen on feed load
    $('.splash-page').fadeOut();
    
}

function hideMainSplash() {
    //Hides the splash screen on feed load
    $('#yourbit-splash').fadeOut('slow');
}