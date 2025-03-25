import express, { NextFunction, Request, Response } from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import Redis from "ioredis";
import mongoose from "mongoose";
import InterviewModel from "./models/InterviewModel";
import { getInterviewQuestions } from "./controllers/interview";
import { evaluateAnswer } from "./controllers/evaluation";
import auth from './routes/auth'
import Sessions from "./models/Sessions";
import jwt, { JwtPayload } from 'jsonwebtoken'

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}
));



const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});
const redis = new Redis({
  host: 'redis',
  port: 6379
});

mongoose.connect("mongodb+srv://sada:sada@cluster0.qaxfxid.mongodb.net/?retryWrites=true&w=majority").then(() => console.log('Connected to Mongo')).catch((e)=> console.log(e))

interface UserSession {
  socket: Socket;
  questions: any[];
  currentIndex: number;
  userId: string;
}

const userSessions: Map<string, UserSession> = new Map();

app.use('/auth' ,auth)

app.get('/' , (req, res)=> {
  res.json('Healthy')
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendjd", async (jd: string) => {
    const questions = await getInterviewQuestions(jd);
    if (!questions || questions.length === 0) return;

    userSessions.set(socket.id, { socket, questions, currentIndex: 0, userId: socket.id });

    // Store JD in Redis
    await redis.set(`interview:${socket.id}:jd`, jd);
    await redis.set(`interview:${socket.id}:answers`, JSON.stringify([]));

    socket.emit("receiveQuestion", questions[0]);
  });

  socket.on("saveAnswer", async ({ question, answer }) => {
    const session = userSessions.get(socket.id);
    if (!session) return;

    const key = `interview:${socket.id}:answers`;

    const { rating, improvedAnswer } = await evaluateAnswer(question, answer);


    const storedAnswers = JSON.parse((await redis.get(key)) || "[]");
    storedAnswers.push({ question, userAnswer: answer, improvedAnswer, rating });

    await redis.set(key, JSON.stringify(storedAnswers));
  });

  socket.on("nextQuestion", () => {
    const session = userSessions.get(socket.id);
    if (!session) return;

    session.currentIndex++;
    if (session.currentIndex < session.questions.length) {
      socket.emit("receiveQuestion", session.questions[session.currentIndex]);
    } else {
      socket.emit("interviewComplete");
    }
  });

  socket.on("submitInterview", async (data) => {
    const userData = JSON.parse(data.user);

    const key = `interview:${socket.id}:answers`;
    const answers = JSON.parse((await redis.get(key)) || "[]");
    // console.log(answers)
    const jd = await redis.get(`interview:${socket.id}:jd`);

    if (answers.length > 0 && jd) {

      const newInterview = new InterviewModel({
        email: userData.email,
        jd: jd,
        answers: answers,
      });

      await newInterview.save();


      await Sessions.findOneAndUpdate(
        { email: userData.email },
        {
          $push: {
            sessions: {
              interviewId: newInterview._id,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
        { upsert: true, new: true }
      );


      await redis.del(key);
      await redis.del(`interview:${socket.id}:jd`);

      socket.emit("submissionSuccess", "Interview saved!");


      socket.emit("interviewFeedback", answers);
    }
});

  socket.on("disconnect", () => {
    userSessions.delete(socket.id);
  });
});


const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
     res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(String(token), process.env.JWT_SECRET!);
    // req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
     res.status(401).json({ message: "Invalid token" });
  }
};


app.get('/api/sessions' ,authMiddleware,  async(req, res)=> {
  try {
    const token = req?.headers?.authorization?.split(" ")[1];
  const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as JwtPayload;
  // console.log(decoded.userId)

  const user = await InterviewModel.findOne({ _id: decoded.userId})
      const sessionData = await Sessions.findOne({ email: user?.email })
      .populate("sessions.interviewId")
      .select('jd answers')
      .exec();
        if (!sessionData) {
       res.status(404).json({ message: "No sessions found" });
    }
    else {

    res.json(sessionData);
    }

  // console.log(decoded)
  } catch (error) {
    res.json(error)
  }
  // try {

  //   const userEmail = req.user.email; // Extract email from decoded JWT

  //   const sessionData = await Sessions.findOne({ email: userEmail })
  //     .populate("sessions.interviewId") // Populate interview details
  //     .exec();

  //   if (!sessionData) {
  //      res.status(404).json({ message: "No sessions found" });
  //   }

  //   res.json(sessionData);
  // } catch (error) {
  //   console.error("Error fetching sessions:", error);
  //   res.status(500).json({ message: "Server error" });
  // }
})

const port = process.env.PORT || 3000;

server.listen(port,  () => console.log(`Server running at http://localhost:${port}`));
