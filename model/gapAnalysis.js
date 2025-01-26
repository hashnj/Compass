import mongoose from 'mongoose';

const gapAnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobDescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescription', required: true },
  missingSkills: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('GapAnalysis', gapAnalysisSchema);
