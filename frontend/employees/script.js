var apiBaseUrl = "https://secure089.onrender.com";


document.addEventListener("DOMContentLoaded", async () => {
    const employeeList = await fetchEmployees();
    if (employeeList) {
      renderEmployeeList(employeeList);
    }
  });

/*
const jobData = await fetchJobData();
  if (jobData) {
    renderShifts(jobData);
}*/

async function fetchEmployees() {
  
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/users/`, {
        method: "GET"
      });
  
      if (response.ok) {
        const employeeList = await response.json();
        return employeeList; // Return the user data
      } else {
        console.error("Failed to fetch employee list:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
      return null;
    }
}

// Function to generate shift cards
function renderEmployeeList(employeeList) {
    console.log(employeeList)
    const container = document.getElementById("employees");
    container.innerHTML = ""; // Clear existing content

    employeeList.forEach(user => {
        if (user.registrationStep == 2) {
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
        }
    });
}
