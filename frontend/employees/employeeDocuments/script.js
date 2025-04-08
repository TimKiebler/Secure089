var apiBaseUrl = "https://secure089.onrender.com";


document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email");

  if (email) {
    sessionStorage.setItem("userEmail", email);
  }
  
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
    const maxSize = 2 * 1024 * 1024; // 2MB limit

    if (file && file.size > maxSize) {
      alert("File size exceeds 2MB. Please upload a smaller file.");
      this.value = ""; // Clear the input
      return;
    }

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
    const response = await fetch(`${apiBaseUrl}/api/v1/files/upload/${field}`, {
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

    const response = await fetch(`${apiBaseUrl}/api/v1/files/metadata/${userEmail}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to retrieve filenames:", error);
    return null;
  }
}

async function downloadFile(field, userEmail) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/files/${field}?email=${userEmail}`);
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
  const urlParams = new URLSearchParams(window.location.search);
  let userEmail = urlParams.get("email") || sessionStorage.getItem("userEmail");

  if (!userEmail) {
      console.error("Es wurde keine Mitarbeiter Mail weitergegeben");
      window.location.href = "../employees.html";
    return null;
  }
  return userEmail;
}

//generating files

const personalfragebogenButton = document.getElementById("button-personalfragebogen");

personalfragebogenButton.addEventListener("click", async () => {
  const userEmail = getUserEmail();

  try {
    // Call the backend API to generate the PDF
    const response = await fetch(`${apiBaseUrl}/api/v1/files/download/personalfragebogen/?email=${userEmail}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Convert the response to a Blob and trigger a download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filled-contract.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log("PDF downloaded successfully");
  } catch (error) {
    console.error("Failed to download PDF:", error);
    alert("Failed to download PDF. Please try again.");
  }
});

const badgeButton = document.getElementById("button-dienstausweis");

badgeButton.addEventListener("click", async () => {
  const userEmail = getUserEmail();

  try {
    // Call the backend API to generate the PDF
    const response = await fetch(`${apiBaseUrl}/api/v1/files/download/dienstausweis/?email=${userEmail}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Convert the response to a Blob and trigger a download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filled-badge.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log("PDF downloaded successfully");
  } catch (error) {
    console.error("Failed to download PDF:", error);
    alert("Failed to download PDF. Please try again.");
  }
});

const contractButton = document.getElementById("button-arbeitsvertrag");

contractButton.addEventListener("click", async () => {
  const userEmail = getUserEmail();
  const JobName = document.getElementById("jobName-input").value;

  try {
    // Call the backend API to generate the PDF
    const response = await fetch(`${apiBaseUrl}/api/v1/files/download/arbeitsvertrag/?email=${userEmail}&jobName=${JobName}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Convert the response to a Blob and trigger a download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filled-badge.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    console.log("PDF downloaded successfully");
  } catch (error) {
    console.error("Failed to download PDF:", error);
    alert("Failed to download PDF. Please try again.");
  }
});

