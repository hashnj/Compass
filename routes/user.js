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
    console.error('Error:', error.message || error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleValidationError = (res, error) => {
  res.status(400).json({
    message: 'Validation error',
    errors: error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    })),
  });
};

authRouter.post(
  '/signin',
  tryCatch(async (req, res) => {
    const validationResult = validLogin.safeParse(req.body);
    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const { email, password } = validationResult.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
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
  })
);

authRouter.post(
  '/signup',
  tryCatch(async (req, res) => {
    const validationResult = validRegister.safeParse(req.body);
    if (!validationResult.success) {
      return handleValidationError(res, validationResult.error);
    }

    const { firstName, lastName, phone, role, email, password } = validationResult.data;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email is already registered' });
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

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        firstname: user.firstName,
        lastname: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  })
);

authRouter.post(
  '/',
  auth,
  tryCatch(async (req, res) => {
    const userId = req.user_id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      role: user.role,
    });
  })
);

authRouter.post(
  '/logout',
  auth,
  tryCatch(async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
  })
);

export default authRouter;
