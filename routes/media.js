import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import Media from '../model/media.js';
import auth from '../middlewares/auth.js';

const mediaRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
});

mediaRouter.post(
  '/upload',
  auth,
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description } = req.body;

      if (!req.files || !req.files.video) {
        return res.status(400).json({ message: 'Video file is required.' });
      }

      const videoFile = req.files.video[0];
      let displayImage = null;

      const videoData = videoFile.buffer.toString('base64');

      if (req.files.displayImage) {
        displayImage = req.files.displayImage[0].buffer.toString('base64');
      }

      const media = await Media.create({
        title,
        description,
        videoData,
        displayImage,
        uploadedBy: req.user.id, 
      });

      res.status(201).json({ message: 'Media uploaded successfully.', media });
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

export default mediaRouter;
