import mongodb from "mongodb";

let jobs;

export default class JobsDAO {
  static async injectDB(conn) {
    if (jobs) {
      return; // No need to reconnect if already connected
    }
    try {
      jobs = await conn.db("secure089").collection("jobs");
      console.log("Connected to jobs collection");
    } catch (e) {
      console.error(`Unable to establish collection: ${e}`);
    }
  }

  static async addJob(jobName, description, employedAs, contractType) {
    try {
      const existingJob = await jobs.findOne({ jobName });
      if (existingJob) {
        return { error: "Job already exists. Please choose a unique name." };
      }

      const applicants = [];

      const jobDoc = {
        jobName,
        description,
        employedAs,
        contractType,
        applicants,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await jobs.insertOne(jobDoc);
      return result;
    } catch (e) {
      console.error(`Unable to add job: ${e}`);
      return { error: e.message };
    }
  }

  static async addApplicantToJob(jobName, aplicantEmailAdresss) {
    try {
      const updateResult = await jobs.updateOne(
        { jobName },
        {
          $addToSet: { applicants: aplicantEmailAdresss },
        }
      );
  
      if (updateResult.matchedCount === 0) {
        return { error: "Job not found." };
      }
  
      if (updateResult.modifiedCount === 0) {
        return { message: "User already applied to this job." };
      }

      await jobs.updateOne(
        { jobName },
        {
          $set: { updatedAt: new Date() }
        }
      );
  
      return { message: "Applicant successfully added." };
    } catch (e) {
      console.error(`Unable to add applicant: ${e}`);
      return { error: e.message };
    }
  }

  static async getApplicantsByJobName(jobName) {
    try {
      const job = await jobs.findOne(
        { jobName },
        { projection: { _id: 0, jobName: 1, applicants: 1 } }
      );
  
      if (!job) {
        return { error: "Job not found." };
      }
  
      return job; 
    } catch (e) {
      console.error(`Failed to get applicants: ${e}`);
      return { error: e.message };
    }
  }
  
  

  static async deleteJob(jobName) {
    try {
      const existingJob = await jobs.findOne({ jobName });
      if (!existingJob) {
        return { error: "The job you're trying to delete does not exist." };
      }
  
      const result = await jobs.deleteOne({ jobName: jobName }); // Use a filter object
      return result;
    } catch (e) {
      console.error(`Unable to delete job: ${e}`);
      return { error: e.message };
    }
  }

  static async getAllJobs() {
    try {
      const jobsList = await jobs.find().toArray();
      return jobsList;
    } catch (e) {
      console.error(`Unable to get jobs: ${e}`);
      return { error: e.message };
    }
  }
}