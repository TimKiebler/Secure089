import JobsDAO from "../dao/jobsDAO.js";
import { sendEmail } from "../mail/automated.email.js";

export default class JobsController {
  static async apiAddJob(req, res) {
    try {
      const { jobName, description, employedAs, contractType } = req.body;

      if (!jobName || !description || !employedAs || !contractType) {
        return res.status(400).json({ error: "Missing required fields: jobName and description" });
      }

      const jobResponse = await JobsDAO.addJob(jobName, description, employedAs, contractType);

      if (jobResponse.error) {
        return res.status(400).json({ error: jobResponse.error });
      }

      res.json({ status: "success", message: "Job added successfully." });
    } catch (e) {
      console.error(`Error in apiAddJob: ${e.message}`);
      res.status(500).json({ error: `Internal server error: ${e.message}` });
    }
  }

  static async apiDeleteJob(req, res) {
    try {
      const { jobName } = req.body;
  
      if (!jobName) {
        return res.status(400).json({ error: "Missing required field: jobName" });
      }
  
      const jobResponse = await JobsDAO.deleteJob(jobName);
  
      if (jobResponse.error) {
        return res.status(400).json({ error: jobResponse.error });
      }
  
      if (jobResponse.deletedCount === 0) {
        return res.status(404).json({ error: "Job not found or already deleted." });
      }
  
      res.json({ status: "success", message: "Job deleted successfully." });
    } catch (e) {
      console.error(`Error in apiDeleteJob: ${e.message}`);
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

  static async apiApplyForJob(req, res) {
    const { aplicantEmailAdresss, jobName } = req.body; 

    if (!aplicantEmailAdresss || !jobName) {
      return res.status(400).json({ error: "Missing required fields (aplicantEmailAdresss, jobName, aplicantName)" });
    }

    try {
      const content =  aplicantEmailAdresss + 
      " hat sich auf die folgende Position beworben: " + jobName;
      
      await sendEmail("tim.kiebler@gmail.com", "neue Bewerbung", content);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  }
}