const urlParams = new URLSearchParams(window.location.search);
const employeeEmail = urlParams.get("email");


document.addEventListener("DOMContentLoaded", async () => {
    await displayUploadedFilenames();
  });
  
  const fileInputs = {
    foto: document.getElementById("foto"),
    lebenslauf: document.getElementById("lebenslauf"),
    "34a": document.getElementById("34a"),
    sachkundepruefung: document.getElementById("sachkundeprüfung"),
  };
  
  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", handleFileUpload);
  
  async function handleFileUpload() {
    const userEmail = getUserEmail();
    if (!userEmail) return;
  
    for (const field in fileInputs) {
      const file = fileInputs[field].files[0];
      if (file) {
        await uploadFileToField(field, file, userEmail);
      }
    }
  }
  
  async function uploadFileToField(field, file, userEmail) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", userEmail);
  
    try {
      const response = await fetch(`http://localhost:8000/api/v1/files/upload/${field}`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("Upload successful:", await response.json());
    } catch (error) {
      console.error("Upload failed:", error);
    }
  }
  
  async function displayUploadedFilenames() {
    const userEmail = getUserEmail();
    if (!userEmail) return;
  
    const uploadedFilenames = await getUploadedFilenames(userEmail);
    if (!uploadedFilenames) return;
  
    for (const field in uploadedFilenames) {
      const fileName = uploadedFilenames[field];
      const displayElement = document.getElementById(`current-${field}`);
      const buttonElement = document.getElementById(`button-${field}`);
  
      if (displayElement) displayElement.innerHTML = `Bereits hochgeladene Datei: ${fileName}`;
      if (buttonElement && fileName !== "keine Datei hochgeladen") {
        buttonElement.style.display = "block";
        buttonElement.addEventListener("click", () => downloadFile(field, userEmail));
      }
    }
  }
  
  async function getUploadedFilenames(userEmail) {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/files/metadata/${userEmail}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Failed to retrieve filenames:", error);
      return null;
    }
  }
  
  async function downloadFile(field, userEmail) {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/files/${field}?email=${userEmail}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition ? contentDisposition.split("filename=")[1].replace(/['"]/g, "") : "downloaded_file";
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      console.log("Download successful");
    } catch (error) {
      console.error("Download failed:", error);
    }
  }
  
  function getUserEmail() {
    const userEmail = employeeEmail;
    if (!userEmail) {
        console.error("Es wurde keine Mitarbeiter Mail weitergegeben");
        window.location.href = "../employees.html";
      return null;
    }
    return userEmail;
  }
  