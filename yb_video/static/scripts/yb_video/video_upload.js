
function yb_sendVideoToServer(url) {
    //Use the upload url returned from cloud flare and send to yourbit server to store in database
    $.ajax({
        type: "POST",
        url: "/video/api/add_video/",
        data: {
            video_url: url
        },
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function yb_startUpload(input_id) {
    const fileInput = document.getElementById(input_id);
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }
    let csrf_token = document.getElementById('csrf-token').value;
    console.log(csrf_token);

    // Step 1: Request pre-signed URL from the server
    $.ajax({
        type: "POST",
        url: "/video/api/get_tus_url/",
        headers: {
            "X-CSRFToken": csrf_token
        },
        success: function (data) {
            const uploadURL = data.upload_url;

            console.log(file.name);
            console.log(file.type);

            // Step 2: Start the upload using tus.js
            const upload = new tus.Upload(file, {
                endpoint: uploadURL, // Pre-signed upload URL
                chunkSize: 5242880, // Optional: 5MB chunks
                retryDelays: [0, 3000, 5000, 10000, 20000],
                metadata: {
                    filename: file.name,
                    filetype: 'video/MP4'
                },
                onError: function (error) {
                    console.error("Failed to upload file:", error);
                },
                onProgress: function (bytesUploaded, bytesTotal) {
                    const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                    console.log(`Uploaded ${percentage}%`);
                },
                onSuccess: function () {
                    console.log("Upload completed successfully:", upload.url);
                    yb_sendVideoToServer(upload.url);
                }
            });

            // Step 3: Start the upload
            upload.start();
        },
        error: function (data) {
            console.log(data);
        }
    });
}