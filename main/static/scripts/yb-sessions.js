/*

                    session_manager.js
                    Dated: 11/8/2022
                    Updated: 11/8/2022
                    Yourbit, LLC


*/




/*
        Tasks on yourbit are actions the user has taken in the current session.

        On redirect from the page tasks are saved in the database under the session table
        The following tasks include
            -#video-task
            -#comment-task
            -#message-task
            -#profile-task
            -#notifications
        
*/


//Tasks is the list that represents active tasks in the task manager
var tasks = []

//Stores ids for videos in video task
var videos = []

//Stores ids for bits in comment tasks
var comments = []

//Stores ids for conversations in conversation tasks
var conversations = []

//Stores ids for profiles in profile tasks
var profiles = []

//Stores ids for communities in community tasks
var communities = []

function syncState() {
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
                return null
                //For task if task = task append task

                //if messages append conversation objects

                //if comments append comment objects

                //if profile append profile objects

                //if video append video objects, add last video, update endtime
                
            }
        }
    )
}

//Start task function initiates a new task in the task manager
function startTask(task, object) {
    if (task="#home-task")  {
        tasks.push(task)
    }
    //Ran on play of a video
    if (task === "#video-task") {
        tasks.push(task);
        videos.push(object);
    }
    //Ran on creation of comment
    if (task === "#comment-task") {
        tasks.push(task);
        comments.push(object);
    }
    //Ran on message send
    if (task === "#message-task") {
        tasks.push(task);
        conversations.push(object);
    }
    //Ran on user profile visitation
    if (task === "#profile-task") {
        tasks.push(task);
        profiles.push(object);
    }
    //Ran on community visitation
    if (task === "#community-task") {
        tasks.push(task);
        communities.push(object)
        
    }
}

//Ran when user closes a task
function endTask(task) {
    //find task
    let index = tasks.indexOf(task);

    tasks.splice(index);

    if (task === '#video-task') {
        for (let i = 0; i < videos.length; i++) {
            videos.pop();
          }
    }

    if (task === '#comment-task') {
        for (let i = 0; i < videos.length; i++) {
            comments.pop();
          }
    }

    if (task === '#message-task') {
        for (let i = 0; i < videos.length; i++) {
            conversations.pop();
          }
    }

    if (task === '#profile-task') {
        for (let i = 0; i < videos.length; i++) {
            profiles.pop();
        }
    }

    if (task === '#community-task') {
        for (let i = 0; i < videos.length; i++) {
            communities.pop();
          }
    }
}

function startSubTask(subtask, object) {
    if (subtask === 'video'){
        videos.push(object);
    }

    if (subtask === 'comment'){
        comments.push(object);
    }
    if (subtask === 'message'){
        messages.push(object);
    }
    if (subtask === 'profile'){
        profiles.push(object);
    }
    if (subtask === 'community'){
        communities.push(object);
    }

}


//Stop tasks within the task widget such as individual conversations, comments, videos, profiles, and communties
function stopSubTask(subtask, object) {
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

function getRunningTasks() {
    return tasks
}

function getSubTasks(task) {
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
function getLoaded() {
    return loaded;
}

//Set loaded changes the loaded value to true. Loaded is only false on initialization
function setLoaded(bool){
    loaded = bool;
}

/*

    Get session values retrieves and returns information from backend context.

*/

var first_space = true; //Used to track first load for animation purposes

function getSessionValues(key) {
    
    let value = $("#session_values").attr(`data-${key}`);
    return value
}

function setSessionValues(key, value) {
    $("#session_values").attr(`data-${key}`, value);
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