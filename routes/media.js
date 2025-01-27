import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import Media from '../model/media.js';
import e from 'express';

const mediaRouter = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 600 * 1024 * 1024 }, 
});






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
