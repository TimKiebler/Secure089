import express from 'express';
import upload from '../multerConfig.js'; 
import FilesController from './files.controller.js'; 

const router = express.Router();

// Endpoint to upload a file
router.post('/upload/:field', upload.single('file'), FilesController.apiUploadFileToField);

// Endpoint to download a file by ID
router.get('/files/:field', FilesController.apiDownloadFile);

export default router;