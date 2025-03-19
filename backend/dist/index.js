"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const ioredis_1 = __importDefault(require("ioredis"));
const mongoose_1 = __importDefault(require("mongoose"));
const InterviewModel_1 = __importDefault(require("./models/InterviewModel"));
const interview_1 = require("./controllers/interview");
const evaluation_1 = require("./controllers/evaluation");
const auth_1 = __importDefault(require("./routes/auth"));
const Sessions_1 = __importDefault(require("./models/Sessions"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});
const redis = new ioredis_1.default();
mongoose_1.default.connect("mongodb://localhost:27017/interviews");
const userSessions = new Map();
app.use('/auth', auth_1.default);
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("sendjd", (jd) => __awaiter(void 0, void 0, void 0, function* () {
        const questions = yield (0, interview_1.getInterviewQuestions)(jd);
        if (!questions || questions.length === 0)
            return;
        userSessions.set(socket.id, { socket, questions, currentIndex: 0, userId: socket.id });
        // Store JD in Redis
        yield redis.set(`interview:${socket.id}:jd`, jd);
        yield redis.set(`interview:${socket.id}:answers`, JSON.stringify([]));
        socket.emit("receiveQuestion", questions[0]);
    }));
    socket.on("saveAnswer", (_a) => __awaiter(void 0, [_a], void 0, function* ({ question, answer }) {
        const session = userSessions.get(socket.id);
        if (!session)
            return;
        const key = `interview:${socket.id}:answers`;
        const { rating, improvedAnswer } = yield (0, evaluation_1.evaluateAnswer)(question, answer);
        const storedAnswers = JSON.parse((yield redis.get(key)) || "[]");
        storedAnswers.push({ question, userAnswer: answer, improvedAnswer, rating });
        yield redis.set(key, JSON.stringify(storedAnswers));
    }));
    socket.on("nextQuestion", () => {
        const session = userSessions.get(socket.id);
        if (!session)
            return;
        session.currentIndex++;
        if (session.currentIndex < session.questions.length) {
            socket.emit("receiveQuestion", session.questions[session.currentIndex]);
        }
        else {
            socket.emit("interviewComplete");
        }
    });
    socket.on("submitInterview", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const userData = JSON.parse(data.user);
        const key = `interview:${socket.id}:answers`;
        const answers = JSON.parse((yield redis.get(key)) || "[]");
        console.log(answers);
        const jd = yield redis.get(`interview:${socket.id}:jd`);
        if (answers.length > 0 && jd) {
            const newInterview = new InterviewModel_1.default({
                email: userData.email,
                jd: jd,
                answers: answers,
            });
            yield newInterview.save();
            yield Sessions_1.default.findOneAndUpdate({ email: userData.email }, {
                $push: {
                    sessions: {
                        interviewId: newInterview._id,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                },
            }, { upsert: true, new: true });
            yield redis.del(key);
            yield redis.del(`interview:${socket.id}:jd`);
            socket.emit("submissionSuccess", "Interview saved!");
            socket.emit("interviewFeedback", answers);
        }
    }));
    socket.on("disconnect", () => {
        userSessions.delete(socket.id);
    });
});
const authMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; // Attach user data to the request
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
app.get('/api/sessions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const token = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // console.log(decoded.userId)
        const user = yield InterviewModel_1.default.findOne({ _id: decoded.userId });
        const sessionData = yield Sessions_1.default.findOne({ email: user === null || user === void 0 ? void 0 : user.email })
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
    }
    catch (error) {
        res.json(error);
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
}));
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
