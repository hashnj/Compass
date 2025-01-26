import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  skills: [{ type: String }], // List of skills extracted from the resume
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
