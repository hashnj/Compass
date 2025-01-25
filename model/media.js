import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoData: { type: String, required: true }, 
    displayImage: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  },
  { timestamps: true } 
);

export default mongoose.model('Media', MediaSchema);
