import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  userId: String,
  jd: String,
  answers: [{ question: String, answer: String }],
});

export default mongoose.model("Interview", InterviewSchema);
