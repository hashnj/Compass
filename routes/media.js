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


authRouter.post(
  '/mentor',
  upload.single('profilePicture'),
  [
    body('email').isEmail().withMessage('A valid email is required.'),
    body('expertise').notEmpty().withMessage('Expertise is required.'),
    body('educationalQualifications').notEmpty().withMessage('Educational qualifications are required.'),
    body('jobTitle').notEmpty().withMessage('Job title is required.'),
    body('experience')
      .isIn(['0-3 years', '3-10 years', '10+ years'])
      .withMessage('Experience must be one of 0-3 years, 3-10 years, or 10+ years.'),
    body('bio').notEmpty().withMessage('Bio is required.').isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters.'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        email,
        expertise,
        educationalQualifications,
        jobTitle,
        experience,
        bio,
      } = req.body;

      console.log('Request Body:', req.body);
      console.log('Uploaded File:', req.file);

      const existingMentor = await Mentor.findOne({ email });
      if (existingMentor) {
        return res.status(400).json({ message: 'Mentor with this email already exists.' });
      }

      let profilePicture = null;
      if (req.file) {
        profilePicture = req.file.buffer.toString('base64');
      }

      const mentor = await Mentor.create({
        email,
        expertise,
        educationalQualifications,
        jobTitle,
        experience,
        bio,
        profilePicture,
      });

      res.status(200).json({ message: 'Mentor profile created successfully.', mentor });
    } catch (error) {
      console.error('Error stack:', error.stack);
      res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  }
);




mediaRouter.get('/list', async (req, res) => {
  try {
    const videos = await Media.find().select('title description displayImage videoData');
    res.status(200).json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



export default mediaRouter;
