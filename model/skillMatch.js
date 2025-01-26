import mongoose from 'mongoose';

const skillMatchSchema = new mongoose.Schema({
  jobDescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescription', required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  matchStatus: { type: String, enum: ['Matched', 'Not Matched'], required: true },
  matchRate: { type: Number, required: true },
  skillGap: [{ type: String }], // List of missing skills
}, { timestamps: true });

export default mongoose.model('SkillMatch', skillMatchSchema);
