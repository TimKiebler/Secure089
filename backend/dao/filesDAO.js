import mongodb from 'mongodb';

let files; // Collection for storing files

export default class FilesDAO {
  static async injectDB(conn) {
    if (files) {
      return;
    }
    try {
      files = await conn.db("secure089").collection("files");
      console.log("Connected to files collection");
    } catch (e) {
      console.error(`Unable to establish collection: ${e}`);
    }
  }

  /**   Method that is only called by users.controller.js, when a new user is
        registered, to add a document to the files collection, that stores
        all the four possible files of a user later on. */
  static async initializeUserFiles(email) {
    try {
      const fileDoc = {
        email, 
        foto: null, 
        lebenslauf: null, 
        "34a": null, 
        sachkundeprüfung: null, 
        createdAt: new Date(), 
        updatedAt: new Date(), 
      };
  
      return await files.insertOne(fileDoc);
    } catch (e) {
      console.error(`Unable to initialize user files: ${e}`);
      return { error: e };
    }
  }

  static async uploadFileToField(email, field, file) {
    try {
       
      const { originalname, mimetype, size, buffer } = file;
  
      const fileData = {
        filename: originalname,
        contentType: mimetype,
        size,
        data: new mongodb.Binary(buffer), // Store file data as Binary
        uploadDate: new Date(),
      };
      // Update the specific field for the user
      const updateDoc = {
        $set: {
          [field]: fileData, // Use dynamic field name
          updatedAt: new Date(),
        },
      };

      return await files.updateOne({ email }, updateDoc);;
    } catch (e) {
      console.error(`Unable to upload file to field: ${e}`);
      return { error: e };
    }
  }

  static async getUserFileField(email, field) {
    try {
      return await files.findOne(
        { email }, 
        { projection: { [field]: 1 } } // Include only the specified field
      );
    } catch (e) {
      console.error(`Unable to get user file field: ${e}`);
      return { error: e };
    }
  }

  static async getUploadedFilenames(email) {
    try {

      const userFiles = await files.findOne(
        { email },
        { projection: { 
            "lebenslauf.filename": 1, 
            "foto.filename": 1, 
            "34a.filename": 1, 
            "sachkundeprüfung.filename": 1 
          } 
        }
      );
  
      if (!userFiles) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Extract filenames only where a file exists
      const filenames = {};
        ["foto", "lebenslauf", "34a", "sachkundeprüfung"].forEach((field) => {
            filenames[field] = userFiles[field]?.filename || "keine Datei hochgeladen";
        });
  
      return filenames;
    } catch (e) {
      console.error(`Error fetching filenames: ${e.message}`);
      return { error: "Internal Server Error" };
    }
  }
  
}
