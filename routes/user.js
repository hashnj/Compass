import express from 'express';
import { validLogin } from '../schema/login.js';
import { validRegister } from '../schema/register.js';
import User from '../model/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { hashPassword, verifyPassword } from '../utils/password.js';
import auth from '../middlewares/auth.js';

dotenv.config();

const JwtSecret = process.env.JWT_SECRET;
const authRouter = express.Router();

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
    secure: true,
    sameSite: 'strict',
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
  // console.log(user);
  if(user){
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

export default authRouter;
