document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registration-form");
    const submitButton = document.getElementById("submit-button");
  
    submitButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent the default form submission
  
      // Collect form data
      const password = document.getElementById("Password").value;
      const firstName = document.getElementById("Vorname").value;
      const lastName = document.getElementById("Nachname").value;
      const email = document.getElementById("email").value;
      const confirmation = document.getElementById("bestätigung").checked;
  
      // Validate form data
      if (!password || !firstName || !lastName || !email) {
        alert("Bitte füllen Sie alle Felder aus.");
        return;
      }
  
      if (!confirmation) {
        alert("Bitte bestätigen Sie, dass Ihre Angaben korrekt sind.");
        return;
      }
  
      // Prepare the data for the API request
      const userData = {
        firstName,
        lastName,
        email,
        password,
      };
  
      try {
        // Send the data to the backend
        const response = await fetch("http://localhost:8000/api/v1/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Registration successful
          console.log(result);
          window.location.href = "../home/home.html"; // Redirect on success
        } else {
          // Registration failed
          alert(`Fehler bei der Registrierung: ${result.error}`);
        }
      } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
      }
    });
  });