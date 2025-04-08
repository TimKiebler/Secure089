document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const apiBaseUrl = "https://secure089.onrender.com";

        try {
            const response = await fetch(`${apiBaseUrl}/api/v1/users/login`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token); // Save JWT token
                localStorage.setItem("email", data.email); // Sabe username
                window.location.href = "../home/home.html"; // Redirect on success
            } else {
                alert(`Fehler: ${data.error}`);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Es gab ein Problem beim Login.");
        }
    });
});
