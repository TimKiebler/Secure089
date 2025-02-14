// Sample shift data
const shifts = [
    { name: "Morning Shift", description: "Start at 8 AM", requirements: "Must be punctual", positions: 5, positionsLeft: 1 },
    { name: "Afternoon Shift", description: "Start at 2 PM", requirements: "Experience preferred", positions: 3, positionsLeft: 2 },
    { name: "Night Shift", description: "Start at 10 PM", requirements: "Night owl required", positions: 2, positionsLeft: 1 }
];

// Function to generate shift cards
function renderShifts() {
    const container = document.getElementById("shift-container");
    container.innerHTML = ""; // Clear existing content

    shifts.forEach(shift => {
        // Create div for shift
        const shiftDiv = document.createElement("div");
        shiftDiv.classList.add("shift-card");

        // Fill div with shift details
        shiftDiv.innerHTML = `
            <h2>${shift.name}</h2>
            <hr>
            <p><strong>Beschreibung:</strong> ${shift.description}</p>
            <p><strong>Vorrausetzungen:</strong> ${shift.requirements}</p>
            <p class="positions"><strong>Anzahl Positionen:</strong> ${shift.positions}</p>
            <p class="positions"><strong>Positionen noch verfügbar:</strong> ${shift.positionsLeft}</p>
        `;

        // Append to container
        container.appendChild(shiftDiv);
    });
}

// Call function to render shifts when the page loads
document.addEventListener("DOMContentLoaded", renderShifts);
