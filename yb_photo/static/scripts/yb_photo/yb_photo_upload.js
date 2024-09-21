function yb_startImageUpload(file) {
    const options = {
        endpoint: '/photo/get-upload-url/',
        chunkSize: 50 * 1024 * 1024,
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