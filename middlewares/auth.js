
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const token = req.cookies.token;
  // console.log('token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const verified = jwt.verify(token, JwtSecret);
    req.user_id = verified.id;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Forbidden' });
  }
};

export default auth;
