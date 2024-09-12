//browser camera script
// Dependencies: jQuery, yb_photo/yb_photo.js
//

let camera = document.getElementById('camera');
let video = document.getElementById('camera-video');
let canvas = document.getElementById('camera-canvas');
let context = canvas.getContext('2d');
let photo = document.getElementById('camera-photo');
let photo_data = document.getElementById('camera-photo-data');
let camera_button = document.getElementById('camera-button');
let camera_button_text = document.getElementById('camera-button-text');
let camera_button_icon = document.getElementById('camera-button-icon');

let camera_on = false;
let camera_ready = false;
let camera_stream = null;
let camera_width = 320;
let camera_height = 0;


function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
            video.srcObject = stream;
            video.play();
            camera_stream = stream;
            camera_ready = true;
        });
    }
}

function stopCamera() {
    if (camera_stream) {
        camera_stream.getTracks().forEach(function (track) {
            track.stop();
        });
    }
}

function takePhoto() {
    context.drawImage(video, 0, 0, camera_width, camera_height);
    photo_data.value = canvas.toDataURL('image/png');
    photo.setAttribute('src', photo_data.value);
}

function toggleCamera() {
    if (camera_on) {
        stopCamera();
        camera_on = false;
        camera_button_text.innerText = 'Start Camera';
        camera_button_icon.classList.remove('fa-stop');
        camera_button_icon.classList.add('fa-play');
    } else {
        startCamera();
        camera_on = true;
        camera_button_text.innerText = 'Stop Camera';
        camera_button_icon.classList.remove('fa-play');
        camera_button_icon.classList.add('fa-stop');
    }
}

camera_button.addEventListener('click', function () {
    toggleCamera();
});

camera_button.addEventListener('click', function () {
    takePhoto();
});

video.addEventListener('canplay', function (e) {
    if (!camera_height) {
        camera_height = video.videoHeight / (video.videoWidth / camera_width);
        video.setAttribute('width', camera_width);
        video.setAttribute('height', camera_height);
        canvas.setAttribute('width', camera_width);
        canvas.setAttribute('height', camera_height);
    }
});

// End of file yb_camera.js
