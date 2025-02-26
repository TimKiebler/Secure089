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
}
