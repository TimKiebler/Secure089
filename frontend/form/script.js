document.addEventListener("DOMContentLoaded", async () => {
    const userData = await fetchUserData();
    if (userData) {
      populateForm(userData);
    }

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

async function fetchUserData() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("You are not logged in. Redirecting to login page...");
      window.location.href = "../login/login.html";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/me", {
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
    document.getElementById("Geburtdatum").value = userData.dateOfBirth || "";
    document.getElementById("Telefonnummer").value = userData.phoneNumber || "";
    document.getElementById("Staatsangehoerigkeit").value = userData.nationality || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("Familienstand").value = userData.maritalStatus || "";
    document.getElementById("Geschlecht").value = userData.gender || "";
  
    // Address
    document.getElementById("Straße").value = userData.address?.street || "";
    document.getElementById("Hausnummer").value = userData.address?.houseNumber || "";
    document.getElementById("Postleitzahl").value = userData.address?.postalCode || "";
    document.getElementById("Ort").value = userData.address?.city || "";
    document.getElementById("Land").value = userData.address?.country || "";
  
    // Tax Data
    document.getElementById("Geburtsname").value = userData.birthName || "";
    document.getElementById("Geburtsort").value = userData.birthPlace || "";
    document.getElementById("Geburtsland").value = userData.birthCountry || "";
    document.getElementById("Steuer-ID").value = userData.taxId || "";
    document.getElementById("Sozialversicherungsnummer").value = userData.socialSecurityNumber || "";
    document.getElementById("Hauptjob").value = userData.hasMainJob ? "Ja" : "Nein";
    document.getElementById("Student").value = userData.isStudent ? "Ja" : "Nein";
    document.getElementById("Geschlecht").value = userData.isRegisteredUnemployed ? "Ja" : "Nein";
  
    // Bank Details
    document.getElementById("Kontoinhaber").value = userData.bankAccount?.accountHolder || "";
    document.getElementById("BIC").value = userData.bankAccount?.bic || "";
    document.getElementById("IBAN").value = userData.bankAccount?.iban || "";
}