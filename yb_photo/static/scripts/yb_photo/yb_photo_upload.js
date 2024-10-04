function yb_CFImageUpload(file, chunkSize, uploadUrl) {
    const options = {
        endpoint: uploadUrl,
        chunkSize: chunkSize,
        metadata: {
            name: file.name,
            filetype: file.type,
        },
        onError(error) {
            console.error('Failed to upload file:', error);
        },
        onSuccess() {},
        onProgress(bytesUploaded, bytesTotal) {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            console.log(`Uploaded ${percentage}%`);
        },
    }

    let tusUpload = new tus.Upload(file, options);
    tusUpload.start();
}

function yb_startImageUpload(file_field) {
    let form_data = new FormData();
    form_data.append('image_field', document.getElementById(file_field).files[0]);
    let csrf_token = document.getElementById('csrf-token').value;
    $.ajax({
        url: '/photo/new-image-upload/',
        type: 'POST',
        data: form_data,
        headers: {
            'X-CSRFToken': csrf_token,
        },
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
            alert('Upload Succeeded!');
        },
        error: function(error) {
            alert('Upload Failed! You suck!');
            console.error(error);
        }
    });

}