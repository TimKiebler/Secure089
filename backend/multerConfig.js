import multer from 'multer';

// Configure multer to store files in memory (as a Buffer)
const upload = multer({
  storage: multer.memoryStorage(), // Store file in memory as a Buffer
  limits: {
    fileSize: 16 * 1024 * 1024, // Limit file size to 16MB
  },
});

export default upload;