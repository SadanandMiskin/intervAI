import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import Redis from "ioredis";
import mongoose from "mongoose";
import InterviewModel from "./models/InterviewModel";
import { getInterviewQuestions } from "./controllers/interview";
import { evaluateAnswer } from "./controllers/evaluation";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});
const redis = new Redis();

mongoose.connect("mongodb://localhost:27017/interviews");

interface UserSession {
  socket: Socket;
  questions: any[];
  currentIndex: number;
  userId: string;
}

const userSessions: Map<string, UserSession> = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendjd", async (jd: string) => {
    const questions = await getInterviewQuestions(jd);
    if (!questions || questions.length === 0) return;

    userSessions.set(socket.id, { socket, questions, currentIndex: 0, userId: socket.id });
    await redis.set(`interview:${socket.id}:answers`, JSON.stringify([]));

    socket.emit("receiveQuestion", questions[0]);
  });

  socket.on("saveAnswer", async ({ question, answer }) => {
    const session = userSessions.get(socket.id);
    if (!session) return;

    const key = `interview:${socket.id}:answers`;

    // Send answer to LLM for evaluation
    const { rating, improvedAnswer } = await evaluateAnswer(question, answer);

    // Store answer, improved answer, and rating
    const storedAnswers = JSON.parse((await redis.get(key)) || "[]");
    storedAnswers.push({ question, originalAnswer: answer, improvedAnswer, rating });

    await redis.set(key, JSON.stringify(storedAnswers));
  });

  socket.on("nextQuestion", () => {
    const session = userSessions.get(socket.id);
    if (!session) return;

    session.currentIndex++;
    if (session.currentIndex < session.questions.length) {
      socket.emit("receiveQuestion", session.questions[session.currentIndex]);
    } else {
      socket.emit("interviewComplete"); // Notify the client that the interview is complete
    }
  });

  socket.on("submitInterview", async () => {
    const session = userSessions.get(socket.id);
    if (!session) return;

    const key = `interview:${socket.id}:answers`;
    const answers = JSON.parse((await redis.get(key)) || "[]");

    if (answers.length > 0) {
      await InterviewModel.create({ userId: socket.id, answers });
      await redis.del(key);
      socket.emit("submissionSuccess", "Interview saved!");

      // Emit the feedback to the client
      socket.emit("interviewFeedback", answers);
    }
  });

  socket.on("disconnect", () => {
    userSessions.delete(socket.id);
  });
});

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
