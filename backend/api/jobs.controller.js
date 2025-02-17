import JobsDAO from "../dao/jobsDAO.js";

export default class JobsController {
  static async apiAddJob(req, res) {
    try {
      const { jobName, description } = req.body;

      if (!jobName || !description) {
        return res.status(400).json({ error: "Missing required fields: jobName and description" });
      }

      const jobResponse = await JobsDAO.addJob(jobName, description);

      if (jobResponse.error) {
        return res.status(400).json({ error: jobResponse.error });
      }

      res.json({ status: "success", message: "Job added successfully." });
    } catch (e) {
      console.error(`Error in apiAddJob: ${e.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async apiGetJobs(req, res) {
    try {
      const jobs = await JobsDAO.getAllJobs();
      res.json(jobs);
    } catch (e) {
      console.error(`Error in apiGetJobs: ${e.message}`);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}