
async function uploadFileToField(field, file) {
  const formData = new FormData();
  formData.append('file', file);
  
  const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      window.location.href = "../login/login.html";
      return;
    }
  
    // Add metadata to the form data
    formData.append('email', userEmail); 

  try {
    
    const response = await fetch(`http://localhost:8000/api/v1/files/upload/${field}`, {
      method: 'POST',
      body: formData,
    });
    console.log("Response received:", response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

const fileInput = document.getElementById('lebenslauf');
const submitButton = document.getElementById('submit-button');
// Trigger upload when a file is selected
submitButton.addEventListener('click', async (event) => {
  const file = fileInput.files[0]; // Get the selected file
  if (file) {
    uploadFileToField("lebenslauf", file);
  }
});
const lebenslaufButton = document.getElementById('button-lebenslauf');
// Trigger upload when a file is selected
lebenslaufButton.addEventListener('click', async (event) => {
  downloadFile("lebenslauf");
});


async function downloadFile(field) {
  const userEmail = localStorage.getItem('email');
  if (!userEmail) {
    window.location.href = "../login/login.html";
    return;
  }

  try {
    // Fetch the file from the backend
    const response = await fetch(`http://localhost:8000/api/v1/files/files/${field}?email=${userEmail}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/['"]/g, '')
      : 'downloaded_file';

    // Convert the response to a Blob and create a download link
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log('Download successful');
  } catch (error) {
    console.error('Download failed:', error);
  }
}

