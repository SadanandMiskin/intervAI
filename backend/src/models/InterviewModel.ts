import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  userId: String,
  username: String,
  googleId: String,
  email: String,
  jd: String,
  answers: [
    {
      question: String,
      userAnswer: String,
      rating: Number,
      improvedAnswer: String,
    },
  ],
});

export default mongoose.model("Interview", InterviewSchema);
