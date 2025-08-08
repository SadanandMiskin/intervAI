import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  email: {
    type: String,
    // required: true,
    // unique: true,
  },
  sessions: [
    {
      interviewId: { type: mongoose.Schema.Types.ObjectId, ref: "Interview" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});
export default mongoose.model("Session", SessionSchema);
