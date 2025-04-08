var apiBaseUrl = "https://secure089.onrender.com";


document.addEventListener("DOMContentLoaded", function () {
// Show further information if applicant has further jobs
    const yesOption = document.getElementById("Hauptjob-yes");
    const noOption = document.getElementById("Hauptjob-no");
    const extraInfoDiv = document.getElementById("extra-info");

    function toggleVisibility() {
        extraInfoDiv.style.display = yesOption.checked ? "flex" : "none";
    }

    yesOption.addEventListener("change", toggleVisibility);
    noOption.addEventListener("change", toggleVisibility);
});

document.addEventListener("DOMContentLoaded", async () => {
    const userData = await fetchUserData();
    if (userData) {
      populateForm(userData);
    }
});

async function fetchUserData() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("You are not logged in. Redirecting to login page...");
      window.location.href = "../login/login.html";
      return;
    }
  
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/users/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Include the token in the header
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        return userData; // Return the user data
      } else {
        console.error("Failed to fetch user data:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
}

function populateForm(userData) {
    if (!userData) {
      console.error("No user data provided.");
      return;
    }
  
  
    // Personal Data
    document.getElementById("Vorname").value = userData.firstName || "";
    document.getElementById("Nachname").value = userData.lastName || "";
    document.getElementById("Geburtdatum").value = userData.additionalData?.dateOfBirth || "";
    document.getElementById("Telefonnummer").value = userData.additionalData?.phoneNumber || "";
    document.getElementById("Staatsangehoerigkeit").value = userData.additionalData?.nationality || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("Familienstand").value = userData.additionalData?.maritalStatus || "";
    document.getElementById("Geschlecht").value = userData.additionalData?.gender || "";
    document.getElementById("Bewacher-ID").value = userData.additionalData?.guardId || "";
  
    // Address
    document.getElementById("Straße").value = userData.additionalData?.address?.street || "";
    document.getElementById("Hausnummer").value = userData.additionalData?.address?.houseNumber || "";
    document.getElementById("Postleitzahl").value = userData.additionalData?.address?.postalCode || "";
    document.getElementById("Ort").value = userData.additionalData?.address?.city || "";
    document.getElementById("Land").value = userData.additionalData?.address?.country || "";
  
    // Birth Details
    document.getElementById("Geburtsname").value = userData.additionalData?.birthDetails?.birthName || "";
    document.getElementById("Geburtsort").value = userData.additionalData?.birthDetails?.birthPlace || "";
    document.getElementById("Geburtsland").value = userData.additionalData?.birthDetails?.birthCountry || "";
  
    // Tax Details
    document.getElementById("Steuer-ID").value = userData.additionalData?.taxDetails?.taxId || "";
    document.getElementById("Sozialversicherungsnummer").value = userData.additionalData?.taxDetails?.socialSecurityNumber || "";
  
    // Insurance Details
    document.getElementById("versicherung").value = userData.additionalData?.insuranceDetails?.insuranceType || "";
    document.getElementById("Krankenkasse").value = userData.additionalData?.insuranceDetails?.healthInsurance || "";
  
    // Student Status
    document.getElementById("Student").value = userData.additionalData?.isStudent ? "Ja" : "Nein";
  
    // Other Job Details
    const hasOtherJob = userData.additionalData?.hasOtherJob || false;
    if (hasOtherJob) {
      document.getElementById("Hauptjob-yes").checked = true;
      document.getElementById("extra-info").style.display = "block"; // Show additional fields
      document.getElementById("company-name").value = userData.additionalData?.otherJobDetails?.companyName || "";
      document.getElementById("start-job").value = userData.additionalData?.otherJobDetails?.startDate || "";
      document.getElementById("job-type").value = userData.additionalData?.otherJobDetails?.jobType || "";
      document.getElementById("salary").value = userData.additionalData?.otherJobDetails?.salary || "";
    } else {
      document.getElementById("Hauptjob-no").checked = true;
      document.getElementById("extra-info").style.display = "none"; // Hide additional fields
    }
  
    // Bank Details
    document.getElementById("Kontoinhaber").value = userData.additionalData?.bankDetails?.bankAccountHolder || "";
    document.getElementById("kreditinstitut").value = userData.additionalData?.bankDetails?.bankName || "";
    document.getElementById("IBAN").value = userData.additionalData?.bankDetails?.iban || "";
  }