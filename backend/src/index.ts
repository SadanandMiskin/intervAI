import express, { Express, Request, Response, NextFunction } from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { getInterviewQuestions } from "./controllers/interview"; // Assuming this generates LLM questions

const app: Express = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

interface UserSession {
  socket: Socket;
  questions: any[];
  currentIndex: number;
}

const userSessions: Map<string, UserSession> = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendjd", async (jd: string) => {
    console.log("Received JD:", jd);

    const questions = await getInterviewQuestions(jd); // Get questions from LLM
    if (!questions || questions.length === 0) return;

    userSessions.set(socket.id, {
      socket,
      questions,
      currentIndex: 0,
    });

    // Send the first question
    socket.emit("receiveQuestion", questions[0]);
  });

  socket.on("nextQuestion", () => {
    const session = userSessions.get(socket.id);
    if (!session) return;

    session.currentIndex++;
    if (session.currentIndex < session.questions.length) {
      session.socket.emit("receiveQuestion", session.questions[session.currentIndex]);
    } else {
      session.socket.emit("receiveQuestion", { question: "No more questions available." });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    userSessions.delete(socket.id);
  });
});

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
