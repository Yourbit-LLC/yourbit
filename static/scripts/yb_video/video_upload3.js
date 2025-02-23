const getExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date;
};

function yb_startUpload(file, chunksize, endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            endpoint: endpoint,
            chunkSize: chunksize,
            metadata: {
                expiry: 600,
                maxDurationSeconds: 3600,
                name: file.name,
                filetype: file.type,
            },
            onError(error) {
                console.error('Failed to upload file:', error);
                reject(error); // Reject the promise on failure
            },
            onSuccess() {
                console.log('Upload completed successfully');
                resolve(); // Resolve the promise on success
            },
            onProgress(bytesUploaded, bytesTotal) {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                console.log(`Uploaded ${percentage}%`);
                
                
            },


        }

        let tusUpload = new tus.Upload(file, options);
        tusUpload.start();
    });
}