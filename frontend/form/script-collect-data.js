document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit-button");
  
    submitButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent form submission
  
      // Collect all form data
      const formData = {
        firstName: document.getElementById("Vorname").value,
        lastName: document.getElementById("Nachname").value,
        email: document.getElementById("email").value,
        dateOfBirth: document.getElementById("Geburtdatum").value,
        phoneNumber: document.getElementById("Telefonnummer").value,
        nationality: document.getElementById("Staatsangehoerigkeit").value,
        maritalStatus: document.getElementById("Familienstand").value,
        gender: document.getElementById("Geschlecht").value,
        guardId: document.getElementById("Bewacher-ID").value,

        street: document.getElementById("Straße").value,
        houseNumber: document.getElementById("Hausnummer").value,
        postalCode: document.getElementById("Postleitzahl").value,
        city: document.getElementById("Ort").value,
        country: document.getElementById("Land").value,
        
        birthName: document.getElementById("Geburtsname").value,
        birthPlace: document.getElementById("Geburtsort").value,
        birthCountry: document.getElementById("Geburtsland").value,
        taxId: document.getElementById("Steuer-ID").value,
        socialSecurityNumber: document.getElementById("Sozialversicherungsnummer").value,
        insuranceType: document.getElementById("versicherung").value,
        healthInsurance: document.getElementById("Krankenkasse").value,
        isStudent: document.getElementById("Student").value === "Ja",

        hasOtherJob: document.getElementById("Hauptjob-yes").checked,
        otherJobDetails: {
          companyName: document.getElementById("company-name").value,
          startDate: document.getElementById("start-job").value,
          jobType: document.getElementById("job-type").value,
          salary: document.getElementById("salary").value,
        },
        bankAccountHolder: document.getElementById("Kontoinhaber").value,
        bankName: document.getElementById("kreditinstitut").value,
        iban: document.getElementById("IBAN").value,
      };
  
      // Send the data to the backend
      try {
        const response = await fetch("http://localhost:8000/api/v1/users/register/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("Stammdaten erfolgreich aktualisiert!");
          console.log(result);
        } else {
          alert(`Fehler: ${result.error}`);
        }
      } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
        alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
      }
    });
  });