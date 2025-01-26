// index.js
import express from 'express';
import connectDB from './db/index.js';
import authRouter from './routes/user.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import resumeRouter from './routes/resumeRouter.js';
import jobRouter from './routes/jobRouter.js';
import dashboardRouter from './routes/dashBoard.js';

dotenv.config();

const app = express();

connectDB();

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5176', 'https://careercompass-58en.onrender.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/resumes', resumeRouter);
app.use('/jobs', jobRouter);
app.use('/dashboard', dashboardRouter);


app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
