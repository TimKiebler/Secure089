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