import FilesDAO from '../dao/filesDAO.js';
import { fetchUserAndFillPDF } from "../contractAutoFill/fillPersonalfragebogen.js"; 
import { fetchUserAndFillContract } from "../contractAutoFill/fillArbeitsvertrag.js"; 
import { fetchUserAndFillBadge } from "../contractAutoFill/fillBatch.js"; 


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

  static async apiGetMetadata(req, res) {
    try {
      const { email } = req.params; // Get the user's email from the query parameters
  
      if (!email) {
        return res.status(400).json({ error: 'User email not found' });
      }
      // Fetch the user's uploaded filenames
      const metadata = await FilesDAO.getUploadedFilenames(email);
  
      if (!metadata) {
        return res.status(404).json({ error: 'User files not found' });
      }
  
      res.json(metadata);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetPersonalfragebogen(req, res) {
    const { email } = req.query; 

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Fetch user data and fill the PDF
      const pdfBytes = await fetchUserAndFillPDF(email);
      
      if (!pdfBytes || pdfBytes.length === 0) {
        console.log("Generated PDF is empty")
        return res.status(500).json({ error: "Generated PDF is empty" });
      }
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="filled-contract.pdf"');
      res.setHeader("Content-Length", pdfBytes.length); // Ensure correct file size
      res.end(Buffer.from(pdfBytes)); // Correct way to send binary data
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  }

  static async apiGetArbeitsvertrag(req, res) {
    const { email, jobName } = req.query; 

    if (!email || !jobName) {
      return res.status(400).json({ error: "Email and jobName is required" });
    }

    try {
      // Fetch user data and fill the PDF
      const pdfBytes = await fetchUserAndFillContract(email, jobName);
      
      if (!pdfBytes || pdfBytes.length === 0) {
        console.log("Generated PDF is empty")
        return res.status(500).json({ error: "Generated PDF is empty" });
      }
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="filled-contract.pdf"');
      res.setHeader("Content-Length", pdfBytes.length); // Ensure correct file size
      res.end(Buffer.from(pdfBytes)); // Correct way to send binary data
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  }

  static async apiGetDienstausweis(req, res) {
    const { email } = req.query; 

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Fetch user data and fill the PDF
      const pdfBytes = await fetchUserAndFillBadge(email);
      
      if (!pdfBytes || pdfBytes.length === 0) {
        console.log("Generated PDF is empty")
        return res.status(500).json({ error: "Generated PDF is empty" });
      }
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", 'attachment; filename="filled-contract.pdf"');
      res.setHeader("Content-Length", pdfBytes.length); // Ensure correct file size
      res.end(Buffer.from(pdfBytes)); // Correct way to send binary data
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  }
}