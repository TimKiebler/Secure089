document.addEventListener("DOMContentLoaded", async () => {
    const jobData = await fetchJobData();
    if (jobData) {
      renderShifts(jobData);
    }
    const plusIcon = document.getElementById("plus-icon");

    plusIcon.addEventListener("click", async () => {
        addNewJob();
    });
});

async function addNewJob() {
  // Get input values
  const jobName = document.getElementById("job-name").value.trim();
  const jobDescription = document.getElementById("job-description").value.trim();
  const employedAs =  document.querySelector('input[name="employed-as"]:checked')?.value;
  const contractType = document.querySelector('input[name="contractType"]:checked')?.value;

  if (!jobName || !jobDescription || !employedAs || !contractType) {
      alert("Bitte geben Sie einen Job-Namen und eine Beschreibung ein.");
      return;
  }

  try {
    // Send the data to the backend
    const response = await fetch("http://localhost:8000/api/v1/users/jobs/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'jobName': jobName,
        'description': jobDescription,
        'employedAs': employedAs,
        'contractType': contractType
      }),
    });
 
    const result = await response.json();

    if (response.ok) {
      // Insertion successful
      console.log(result);
      // Clear input fields
      document.getElementById("job-name").value = "";
      document.getElementById("job-description").value = "";
      // refresh UI 
      location.reload();
    } else {
      // Insertion failed
      alert(`Fehler bei der Einfügung: ${result.error}`);
    }
  } catch (error) {
    console.error("Fehler beim Senden der Daten:", error);
    alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
  }
}

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
    const container = document.getElementById("shift-container");

    jobData.forEach(job => {
        const formattedDescription = job.description.replace(/\n/g, "<br>");

        // Create div for shift
        const shiftDiv = document.createElement("div");
        shiftDiv.classList.add("shift-card");

        // Fill div with shift details
        shiftDiv.innerHTML = `
            <div class="top">
              <h2>${job.jobName}</h2>
              <img src="trashcan-icon.png" class="trashcan-icon" data-jobname="${job.jobName}">
            </div>
            <hr>
            <p><strong>Beschreibung:</strong> ${formattedDescription}</p>
            
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
        body: JSON.stringify({ 'jobName': jobName }) 
        
    });
    if (response.ok) {
        console.log(`Job "${jobName}" erfolgreich gelöscht.`);
        // reload UI
        location.reload();
    } else {
        console.error(`Fehler beim Löschen des Jobs "${jobName}":`, response.statusText);
    }
  } catch (error) {
      console.error(`Fehler beim Löschen des Jobs "${jobName}":`, error);
  }
}
