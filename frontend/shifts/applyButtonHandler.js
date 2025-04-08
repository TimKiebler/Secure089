var apiBaseUrl = "https://secure089.onrender.com";


document.addEventListener("DOMContentLoaded", async () => {
    const registrationComplete = checkIfUserHasCompletedRegistration(await fetchUserData());

    document.getElementById("shift-container").addEventListener("click", (event) => {
        if (event.target.classList.contains("apply-button")) {
            if (registrationComplete) {
                handleApplyButtonClick(event.target);
            } else {
                alert("Bitte verfolständigen sie erst ihre Daten in Stammdaten!");
                return;
            }
        }
    });
});

function handleApplyButtonClick(button) {
    const shiftCard = button.closest(".shift-card");

    if (!shiftCard) {
        console.error("Shift card not found!");
        return;
    }

    const shiftName = shiftCard.querySelector("h2").innerText;

    console.log(`Apply button clicked for shift: ${shiftName}`);

    applyForJob(shiftName,);
}

async function applyForJob(jobName) {
  const applicantEmailAddress = localStorage.getItem("email");

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/users/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicantEmailAddress, jobName }),
    });

    if (!response.ok) {
      alert(`Fehler: Sie haben sich bereits auf diese Stelle beworben`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

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
  
  function checkIfUserHasCompletedRegistration(userData) {
    if (!userData) {
      console.error("No user data provided.");
      return false; // Return false if no user data is provided
    }
    console.log("Registration step:", userData.registrationStep); 
    if (userData.registrationStep == 2) {
        return true;
    } else {
        return false;
    }
  }
