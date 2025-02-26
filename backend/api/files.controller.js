import FilesDAO from '../dao/filesDAO.js';

export default class FilesController {
  
  static async apiUploadFileToField(req, res) {
    try {
      const { field } = req.params; // Field name (foto, lebenslauf, 34a, sachkundeprüfung)
      const email = req.body.email; // Get email from formData

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      if (!email) {
        return res.status(400).json({ error: 'User email not found' });
      }
  
      // Upload the file to the specified field
      const uploadResult = await FilesDAO.uploadFileToField(email, field, req.file);
      
      if (uploadResult.error) {
        return res.status(500).json({ error: uploadResult.error});
      }
  
      res.status(201).json({ message: 'File uploaded successfully', fileId: uploadResult.insertedId });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Download a file by ID
  static async apiDownloadFile(req, res) {
    try {
    const { field } = req.params; // Field name (foto, lebenslauf, 34a, sachkundeprüfung)
    const email = req.query.email; // Get the user's email from the query parameters

    if (!email) {
      return res.status(400).json({ error: 'User email not found' });
    }

    // Fetch only the specified field for the user
    const userFiles = await FilesDAO.getUserFileField(email, field);

    if (!userFiles || !userFiles[field]) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = userFiles[field]; // Get the file from the specified field
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set headers for file download
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

    // Send the file data
    res.send(file.data.buffer); // Access the binary data from the Binary object
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
  }
}