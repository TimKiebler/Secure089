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

  static async addJob(jobName, description) {
    try {
      const existingJob = await jobs.findOne({ jobName });
      if (existingJob) {
        return { error: "Job already exists. Please choose a unique name." };
      }

      const jobDoc = {
        jobName,
        description,
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