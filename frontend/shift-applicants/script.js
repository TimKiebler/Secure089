document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobName = urlParams.get("jobName");

    const applicantsList = await fetchApplicants(jobName);
    if (applicantsList) {
      renderEmployeeList(applicantsList);
    }
  });

async function fetchApplicants(jobName) {
  if (!jobName) {
    console.error("No job name provided.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8000/api/v1/users/getApplicants?jobName=${encodeURIComponent(jobName)}`, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.applicants;
  } catch (error) {
    console.error("Error fetching applicants:", error);
  }
}

async function fetchApplicantData(applicantEmailAddress) {
  try {
    // Pass the email as a query parameter
    const url = `http://localhost:8000/api/v1/users/getUser?email=${encodeURIComponent(applicantEmailAddress)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(`HTTP-Error! Status: ${response.status}`);
      }
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    throw error; // Re-throw the error for further handling
  }
}

// Function to generate shift cards
async function renderEmployeeList(applicantsList) {
    const container = document.getElementById("employees");
    container.innerHTML = ""; // Clear existing content

    applicantsList.forEach(async applicantEmailAddress => {
        const user = await fetchApplicantData(applicantEmailAddress);
        const shiftDiv = document.createElement("div");
        shiftDiv.classList.add("employee-card");

        // Fill div with user details
        shiftDiv.innerHTML = `
            <h2>${user.firstName} ${user.lastName}</h2>
            <hr>
            <p><strong>Kontakt:</strong></p>
            <p style="text-indent: 30px;"><strong>Email:</strong> ${user.email}</p>
            <p style="text-indent: 30px;"><strong>Telefon:</strong> ${user.additionalData?.phoneNumber}</p>
            <p><strong>Adresse:</strong></p>
            <p style="text-indent: 30px;">${user.additionalData?.address?.street} ${user.additionalData?.address?.houseNumber}</p>
            <p style="text-indent: 30px;">${user.additionalData?.address?.postalCode} ${user.additionalData?.address?.city}</p>
            <p><strong>Weitere Informationen:</strong></p>
            <p style="text-indent: 30px;"><strong>Geburtsort:</strong> ${user.additionalData?.birthDetails?.birthPlace}</p>
            <p style="text-indent: 30px;"><strong>Geburtsland:</strong> ${user.additionalData?.birthDetails?.birthCountry}</p>
            <p style="text-indent: 30px;"><strong>Geburtsdatum:</strong> ${user.additionalData?.dateOfBirth}</p>
            <p style="text-indent: 30px;"><strong>Nationalität:</strong> ${user.additionalData?.nationality}</p>

            <div id="button-container">
              <a href="./employeeDocuments/employee.html?email=${user.email}" class="button-style">zugehörige Dokumente</a>
            </div>
        `;

        // Append to container
        container.appendChild(shiftDiv);
        
    });
}
