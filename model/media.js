import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoData: { type: String, required: true }, // Base64 encoded video
  displayImage: { type: String }, // Base64 encoded image
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Optional user reference
  createdAt: { type: Date, default: Date.now },
});

const Media = mongoose.model('Media', mediaSchema);

export default Media;
