import express from "express";
import { createInterview } from "../controllers/interview";

const router = express.Router();

router.post("/create", createInterview);

export default router;
