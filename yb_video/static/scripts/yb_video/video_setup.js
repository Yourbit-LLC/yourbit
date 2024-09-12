//Capture the first frame of a video in the upload form
function yb_getFirstFrame(video, canvas) {
    let context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
}

//Turn frame into a png image to be used as a thumbnail
function yb_frameToImage(canvas) {
    return canvas.toDataURL('image/png');
}

function startUpload() {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to upload.");
        return;
    }

    // Step 1: Request pre-signed URL from the server
    fetch("/video/api/get_tus_upload_url/", {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        const uploadURL = data.upload_url;

        // Step 2: Start the upload using tus.js
        const upload = new tus.Upload(file, {
            endpoint: uploadURL, // Pre-signed upload URL
            chunkSize: 99614720, // Optional: 99MB chunks
            metadata: {
                filename: file.name,
                filetype: file.type
            },
            onError: function(error) {
                console.error("Failed to upload file:", error);
            },
            onProgress: function(bytesUploaded, bytesTotal) {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                console.log(`Uploaded ${percentage}%`);
            },
            onSuccess: function() {
                console.log("Upload completed successfully:", upload.url);
            }
        });

        // Step 3: Start the upload
        upload.start();
    })
    .catch(error => {
        console.error("Error requesting upload URL:", error);
    });
}