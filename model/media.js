import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoFileId: { type: mongoose.Schema.Types.ObjectId, required: true }, // GridFS file reference
    displayImageFileId: { type: mongoose.Schema.Types.ObjectId }, // Optional GridFS file reference
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
