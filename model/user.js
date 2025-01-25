import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'mentor'], required: true },
    profilePicture: { type: String }, // Stores Base64-encoded image or a URL
    mentorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' }, // Reference to Mentor schema
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
