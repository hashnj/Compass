import mongoose from 'mongoose';

const jobDescriptionSchema = new mongoose.Schema({
  jobName: { type: String, required: true },
  jobRole: String,
  companyName: String,
  location: String,
  description: String,
  requiredSkills: [{ type: String }], // Skills required for the job
  postedDate: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('JobDescription', jobDescriptionSchema);
