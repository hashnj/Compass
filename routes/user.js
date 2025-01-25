import express from 'express';
import { validLogin } from '../schema/login.js';
import { validRegister } from '../schema/register.js';
import User from '../model/user.js';
import Mentor from '../model/mentor.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { hashPassword, verifyPassword } from '../utils/password.js';
import auth from '../middlewares/auth.js';

dotenv.config();

const JwtSecret = process.env.JWT_SECRET;
const authRouter = express.Router();
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const tryCatch = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

authRouter.post('/signin', tryCatch(async (req, res) => {
  const validationResult = validLogin.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ errors: validationResult.error.errors });
  }

  const { email, password } = validationResult.data;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(409).json({ message: 'User not registered' });
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = jwt.sign({ id: user._id.toString() }, JwtSecret);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });

  res.status(200).json({
    firstname: user.firstName,
    lastname: user.lastName,
    email: user.email,
    role: user.role,
  });
}));

authRouter.post('/signup', tryCatch(async (req, res) => {
  const validationResult = validRegister.safeParse(req.body);
  console.log(validationResult);
  console.log(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ errors: validationResult.error.errors });
  }

  const { firstName, lastName, phone, role, email, password } = validationResult.data;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(401).json({ message: 'User already registered' });
  }

  const encryptedPassword = await hashPassword(password);

  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    role,
    password: encryptedPassword,
  });

  const token = jwt.sign({ id: user._id.toString() }, JwtSecret);

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(201).json({ message: 'User registered successfully',user: { firstname: user.firstName, lastname: user.lastName, email: user.email, role: user.role } });
}));

authRouter.post('/', auth ,async(req,res) => {
  const userId= req.user_id;
  const user  = await User.findById(userId);
  if(user){
    console.log(user,'authCheck');
  res.status(200).json({
    firstname:user.firstName,
    lastname:user.lastName,
    email:user.email,
    role:user.role
  });
  }
})

authRouter.post('/logout', auth, tryCatch(async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
}));


const storage = multer.memoryStorage();
const upload = multer({ storage });

authRouter.post(
  '/mentor',
  auth,
  upload.single('profilePicture'),
  [
    body('expertise').notEmpty().withMessage('Expertise is required.'),
    body('educationalQualifications').notEmpty().withMessage('Educational qualifications are required.'),
    body('jobTitle').notEmpty().withMessage('Job title is required.'),
    body('experience')
      .isIn(['0-3 years', '3-10 years', '10+ years'])
      .withMessage('Experience must be one of 0-3 years, 3-10 years, or 10+ years.'),
    body('bio').notEmpty().withMessage('Bio is required.').isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters.'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { expertise, educationalQualifications, jobTitle, experience, bio } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (user.role !== 'mentor') {
        return res.status(403).json({ message: 'Only mentors can create or update profiles.' });
      }

      let profilePicture = null;
      if (req.file) {
        profilePicture = req.file.buffer.toString('base64'); // Convert image to Base64
      }

      // Check if the mentor profile already exists
      let mentor = await Mentor.findOne({ user: userId });

      if (mentor) {
        // Update existing mentor profile
        mentor.expertise = expertise;
        mentor.educationalQualifications = educationalQualifications;
        mentor.jobTitle = jobTitle;
        mentor.experience = experience;
        mentor.bio = bio;
        if (profilePicture) mentor.profilePicture = profilePicture;

        await mentor.save();
      } else {
        mentor = await Mentor.create({
          user: userId,
          expertise,
          educationalQualifications,
          jobTitle,
          experience,
          bio,
          profilePicture,
        });

        // Link mentor profile to user
        user.mentorProfile = mentor._id;
        await user.save();
      }

      res.status(200).json({ message: 'Mentor profile updated successfully.', mentor });
    } catch (error) {
      console.error('Error updating mentor profile:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  }
);




export default authRouter;
