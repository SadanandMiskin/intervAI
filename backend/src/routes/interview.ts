import express from "express";
import { rateAndImproveAnswer, getInterviewFeedback } from "../controllers/evaluation";
import { createInterview } from "../controllers/interview";

const router = express.Router();

// router.post("/create", createInterview);
router.post("/evaluate", rateAndImproveAnswer);
router.get("/feedback/:userId", getInterviewFeedback);

export default router;
