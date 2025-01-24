// index.js
import express from 'express';
import connectDB from './db/index.js';
import authRouter from './routes/user.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

connectDB();

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5176', 'https://your-frontend-domain.com'], // Replace with allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRouter);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
