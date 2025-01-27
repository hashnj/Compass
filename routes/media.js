import express from 'express';

import { body, validationResult } from 'express-validator';
import Media from '../model/media.js';

import { GridFSBucket } from 'mongodb';
import { URI } from '../config.js';

// import e from 'express';

const mediaRouter = express.Router();

// Configure multer for memory storage


import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';


// GridFS Storage configuration
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'uploads', // Specify the bucket name
      filename: `${Date.now()}-${file.originalname}`, // Ensure unique filenames
      metadata: { fieldname: file.fieldname },
    };
  },
});

storage.on('connection', (db) => {
  console.log('GridFS Storage connected successfully');
});

storage.on('error', (error) => {
  console.error('Error in GridFS Storage:', error.message);
});

const upload = multer({ storage });



// Middleware to ensure MongoDB connection
const ensureDbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ message: 'Database connection error' });
  }
  next();
};

mediaRouter.post(
  '/upload',
  ensureDbConnected,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'displayImage', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.video) {
        return res.status(400).json({ message: 'Video file is required.' });
      }

      const videoFile = req.files.video[0];
      if (!videoFile || !videoFile.id) {
        console.error('File upload failed. Video file is missing or invalid.');
        return res.status(500).json({ error: 'File upload failed. Video file is missing or invalid.' });
      }

      const newMedia = new Media({
        title: req.body.title,
        description: req.body.description,
        videoFileId: videoFile.id.toString(),
        displayImageFileId: req.files.displayImage?.[0]?.id?.toString() || null,
      });

      await newMedia.save();

      res.status(201).json({ message: 'Media uploaded successfully.' });
    } catch (error) {
      console.error('Error uploading media:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
);







mediaRouter.get('/stream/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const bucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
    downloadStream.pipe(res);

    downloadStream.on('error', () => {
      res.status(404).json({ message: 'File not found.' });
    });
  } catch (error) {
    console.error('Error streaming file:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
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
