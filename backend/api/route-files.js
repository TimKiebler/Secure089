import express from 'express';
import upload from '../multerConfig.js'; 
import FilesController from './files.controller.js'; 

const router = express.Router();


router.post('/upload/:field', upload.single('file'), FilesController.apiUploadFileToField);

router.get('/:field', FilesController.apiDownloadFile);
router.get('/metadata/:email', FilesController.apiGetMetadata);

router.get('/download/personalfragebogen', FilesController.apiGetPersonalfragebogen);

export default router;