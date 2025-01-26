import express from "express";
import multer from "multer";
import Resume from "../model/resume.js";
import User from "../model/user.js";
import { parsePDF } from "../utils/pdfParser.js";
import { extractSkillsFromText } from "../utils/skillExtractor.js";
import auth from "../middlewares/auth.js";

const resumeRouter = express.Router();
const upload = multer({ dest: "uploads/" });

resumeRouter.post("/upload", auth, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const text = await parsePDF(req.file.path);
    const skills = extractSkillsFromText(text);

    const resume = await Resume.create({
      userId: req.user_id,
      fileName: req.file.originalname,
      skills,
    });

    res.status(201).json({ message: "Resume uploaded successfully", resume });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ error: "Failed to upload resume" });
  }
});

resumeRouter.get("/", auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user_id });
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

resumeRouter.delete("/:id", auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user_id,
    });
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ error: "Failed to delete resume" });
  }
});

export default resumeRouter;
