import {
    Uppy,
    Tus,
    ProgressBar,
} from 'https://releases.transloadit.com/uppy/v3.0.1/uppy.min.mjs';

const uppy = new Uppy({
    debug: true,
    autoProceed: true  // Set to false to manually control upload
});

// Function to fetch the pre-signed upload URL from the backend
async function getPreSignedUrl() {
    try {
        const response = await fetch('/video/api/get_tus_url/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': document.getElementById('csrf-token').value,
            }
        });
        const data = await response.json();
        return data.upload_url;  // Return the pre-signed URL
    } catch (error) {
        console.error('Error fetching pre-signed URL:', error);
        throw error;
    }
}

// Handle successful uploads
const onUploadSuccess = el => (file, response) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = response.uploadURL;
    a.target = '_blank';
    a.appendChild(document.createTextNode(file.name));
    li.appendChild(a);

    document.querySelector(el).appendChild(li);
};

// Add Uppy plugins for ProgressBar and Tus
uppy
    .use(ProgressBar, { target: '.for-ProgressBar', hideAfterFinish: false })
    .on('upload-success', onUploadSuccess('.uploaded-files ol'));

// File input change event listener to add the selected file to Uppy
document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];  // Get the selected file

    if (file) {
        try {
            const preSignedUrl = await getPreSignedUrl();  // Get the upload URL

            // Now use the Tus plugin with the fetched pre-signed URL
            uppy.use(Tus, {
                endpoint: preSignedUrl,  // Use the pre-signed URL
                chunkSize: 50 * 1024 * 1024  // 5MB chunks
            });

            // Add the file to Uppy and start the upload
            uppy.addFile({
                name: file.name,
                type: file.type,
                data: file
            });
        } catch (error) {
            console.error('Error during the upload process:', error);
        }
    }
});

// Button click to manually trigger upload
document.getElementById('video-upload-button').addEventListener('click', () => {
    uppy.upload();
});
