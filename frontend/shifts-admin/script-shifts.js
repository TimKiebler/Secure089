document.addEventListener("DOMContentLoaded", async () => {
    const jobData = await fetchJobData();
    if (jobData) {
      renderShifts(jobData);
    }
  });

async function fetchJobData() {
  
    try {
      const response = await fetch("http://localhost:8000/api/v1/users/jobs/getAll", {
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
            <div id="top">
              <h2>${job.jobName}</h2>
              <img src="trashcan-icon.png" class="trashcan-icon" data-jobname="${job.jobName}">
            </div>
            <hr>
            <p><strong>Beschreibung:</strong> ${job.description}</p>
        `;

        // Append to container
        container.appendChild(shiftDiv);

        // Add event listeners to all trashcan icons
    document.querySelectorAll(".trashcan-icon").forEach(icon => {
      icon.addEventListener("click", function () {
          const jobName = this.getAttribute("data-jobname");
          handleTrashcanClick(jobName);
      });
  });
    });
}

async function handleTrashcanClick(jobName) {
  try {
    const response = await fetch("http://localhost:8000/api/v1/users/jobs/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 'jobName': jobName }) // Sendet den jobName als JSON-Body
        
    });
    if (response.ok) {
        console.log(`Job "${jobName}" erfolgreich gelöscht.`);
        // Nach erfolgreicher Löschung die UI aktualisieren
        const jobData = await fetchJobData();
        if (jobData) {
            renderShifts(jobData);
        }
    } else {
        console.error(`Fehler beim Löschen des Jobs "${jobName}":`, response.statusText);
    }
  } catch (error) {
      console.error(`Fehler beim Löschen des Jobs "${jobName}":`, error);
  }
}
