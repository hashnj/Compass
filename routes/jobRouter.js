import express from "express";
import JobDescription from "../model/jobDescription.js";
import Resume from "../model/resume.js";
import { calculateMatchRate } from "../utils/matchRateCalculator.js";
import auth from "../middlewares/auth.js";

const jobRouter = express.Router();

jobRouter.get("/", auth, async (req, res) => {
  try {
    const jobs = await JobDescription.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

jobRouter.get("/recommendations", auth, async (req, res) => {
  try {
    const userResumes = await Resume.find({ userId: req.user_id });
    const userSkills = userResumes.flatMap((resume) => resume.skills);

    const jobs = await JobDescription.find();
    const recommendations = jobs
      .map((job) => {
        const matchRate = calculateMatchRate(
          userSkills,
          job.requiredSkills || []
        );
        return { ...job.toObject(), matchRate };
      })
      .sort((a, b) => b.matchRate - a.matchRate);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

jobRouter.get("/skill-gap", auth, async (req, res) => {
  try {
    const userResumes = await Resume.find({ userId: req.user_id });
    const userSkills = userResumes.flatMap((resume) => resume.skills);

    const jobs = await JobDescription.find();
    const skillGaps = jobs.map((job) => {
      const missingSkills = job.requiredSkills.filter(
        (skill) => !userSkills.includes(skill)
      );
      return { job: job.jobName, missingSkills };
    });

    res.status(200).json(skillGaps);
  } catch (error) {
    console.error("Error performing skill gap analysis:", error);
    res.status(500).json({ error: "Failed to analyze skill gaps" });
  }
});

export default jobRouter;
