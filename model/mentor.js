import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Link to User schema
    expertise: { type: String, required: true },
    educationalQualifications: { type: String, required: true },
    jobTitle: { type: String, required: true },
    experience: { type: String, enum: ['0-3 years', '3-10 years', '10+ years'], required: true },
    bio: { type: String, required: true, maxlength: 500 },
    profilePicture: { type: String }, // Optional override for mentor-specific profile picture
  },
  { timestamps: true }
);

export default mongoose.model('Mentor', MentorSchema);
