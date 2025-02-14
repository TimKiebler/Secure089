document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const port = process.env['PORT']

        try {
            const response = await fetch(`http://localhost:${port}/api/v1/users/login`, { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login erfolgreich!");
                localStorage.setItem("token", data.token); // Save JWT token
                localStorage.setItem("username", data.username); // Sabe username
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
