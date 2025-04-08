const apiBaseUrl = "https://secure089.onrender.com";

export async function getUserData(email) {
  try {
    // Pass the email as a query parameter
    const url = `${apiBaseUrl}/api/v1/users/getUser?email=${encodeURIComponent(email)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle non-OK responses
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      } else {
        throw new Error(`HTTP-Error! Status: ${response.status}`);
      }
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerdaten:", error);
    throw error; // Re-throw the error for further handling
  }
}