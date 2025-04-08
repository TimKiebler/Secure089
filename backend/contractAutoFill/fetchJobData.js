const apiBaseUrl = "https://secure089.onrender.com";

export async function getJobData(jobName) {
    try {
      // Pass the email as a query parameter
      const url = `${apiBaseUrl}/api/v1/users/jobs/getAll`;
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
      const job = data.find((job) => job.jobName === jobName);

      if (!job) {
        throw new Error(`Job with name "${jobName}" not found`);
      }
  
      return job;
    } catch (error) {
      console.error("Fehler beim Abrufen der Job Daten:", error);
      throw error; // Re-throw the error for further handling
    }
}
