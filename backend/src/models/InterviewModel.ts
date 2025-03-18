import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
  userId: String,
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
