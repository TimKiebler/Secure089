document.getElementById("logout-button").addEventListener("click", () => {
    localStorage.removeItem("token"); // Clear the token
    localStorage.removeItem("email"); // Clear the email
    window.location.href = "../login/login.html"; // Redirect to login page
  });

document.addEventListener("DOMContentLoaded", () => {
// Retrieve token and email from localStorage
const token = localStorage.getItem("token");
const email = localStorage.getItem("email");

if (!token || !email) {
// If token or email is missing, redirect to login page
window.location.href = "../login/login.html";
return;
}
});

document.getElementById("schichten").addEventListener("click", async () => {
  try {
    const userData = await fetchUserData(); // Await the result of fetchUserData
    if (checkIfAdmin(userData)) {
      window.location.href = "../shifts-admin/shifts-admin.html";
    } else {
      window.location.href = "../shifts/shifts.html";
    }
  } catch (error) {
    console.error("Error handling click event:", error);
    alert("An error occurred. Please try again.");
  }
});

async function fetchUserData() {
  const token = localStorage.getItem("token");
  console.log("test");
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

function checkIfAdmin(userData) {
  if (!userData) {
    console.error("No user data provided.");
    return false; // Return false if no user data is provided
  }
  console.log("isAdmin:", userData.isAdmin); // Use console.log instead of console.error for debugging
  return userData.isAdmin; // Return the isAdmin value
}