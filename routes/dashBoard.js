import express from 'express';
import Resume from '../models/Resume.js';
import JobDescription from '../models/JobDescription.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    // Count user resumes
    const resumeCount = await Resume.countDocuments({ userId: req.user_id });

    // Calculate job matches
    const userResumes = await Resume.find({ userId: req.user_id });
    const userSkills = userResumes.flatMap(resume => resume.skills);

    const jobs = await JobDescription.find();
    const jobMatches = jobs.filter(job => {
      const matchRate = (userSkills.filter(skill => job.requiredSkills.includes(skill)).length / job.requiredSkills.length) * 100;
      return matchRate >= 50;
    });

    res.status(200).json({
      resumeCount,
      jobMatches: jobMatches.length,
      skillMatchRate: jobMatches.length > 0 ? Math.round((jobMatches.length / jobs.length) * 100) : 0,
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

export default router;
