import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import Media from '../model/media.js';

const mediaRouter = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 600 * 1024 * 1024 }, 
});

// POST /media/upload endpoint
mediaRouter.post(
  '/upload',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'displayImage', maxCount: 1 },
  ]),
  [
    body('title').notEmpty().withMessage('Title is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
  ],
  async (req, res) => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if video file is provided
      if (!req.files || !req.files.video) {
        return res.status(400).json({ message: 'Video file is required.' });
      }

      const { title, description } = req.body;
      const videoFile = req.files.video[0];

      // Convert video data to base64 (not recommended for large files)
      const videoData = videoFile.buffer.toString('base64');

      // Optional display image
      let displayImage = null;
      if (req.files.displayImage) {
        displayImage = req.files.displayImage[0].buffer.toString('base64');
      }

      // Save media to the database
      const media = await Media.create({
        title,
        description,
        videoData,
        displayImage,
        uploadedBy: req.user?.id || 'anonymous', // Handle optional auth
      });

      res.status(201).json({ message: 'Media uploaded successfully.', media });
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ message: 'Internal server error.', error });
    }
  }
);

export default mediaRouter;
