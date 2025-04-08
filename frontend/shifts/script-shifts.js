var apiBaseUrl = "https://secure089.onrender.com";


document.addEventListener("DOMContentLoaded", async () => {
    const jobData = await fetchEmployees();
    if (jobData) {
      renderShifts(jobData);
    }
  });

/*
const jobData = await fetchJobData();
  if (jobData) {
    renderShifts(jobData);
}*/

async function fetchEmployees() {
  
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/users/jobs/getAll`, {
        method: "GET"
      });
  
      if (response.ok) {
        const jobData = await response.json();
        return jobData; // Return the user data
      } else {
        console.error("Failed to fetch job data:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      return null;
    }
}

// Function to generate shift cards
function renderShifts(jobData) {
    console.log(jobData)
    const container = document.getElementById("shift-container");
    container.innerHTML = ""; // Clear existing content

    jobData.forEach(job => {
        // Create div for shift
        const shiftDiv = document.createElement("div");
        shiftDiv.classList.add("shift-card");

        // Fill div with shift details
        shiftDiv.innerHTML = `
            <h2>${job.jobName}</h2>
            <hr>
            <p><strong>Beschreibung:</strong> ${job.description}</p>
            
            <div class="button-container">
              <button class="apply-button">Bewerben</button>
            </div>
        `;

        // Append to container
        container.appendChild(shiftDiv);
    });
}
