const getExpiryDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date;
};

function yb_startUpload(file, chunksize, endpoint) {
    const options = {
        endpoint: endpoint,
        chunkSize: chunksize,
        metadata: {
            expiry: getExpiryDate().toISOString(),
            maxDurationSeconds: 3600,
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