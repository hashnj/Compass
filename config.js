require('dotenv').config();

export const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/defaultdb';
export const JwtSecret = process.env.JWT_SECRET || 'secret';
export const B_PORT = process.env.PORT || 3300;

