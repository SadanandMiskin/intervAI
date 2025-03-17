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
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});
const redis = new ioredis_1.default();
mongoose_1.default.connect("mongodb://localhost:27017/interviews");
const userSessions = new Map();
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("sendjd", (jd, userId) => __awaiter(void 0, void 0, void 0, function* () {
        const questions = yield (0, interview_1.getInterviewQuestions)(jd);
        if (!questions || questions.length === 0)
            return;
        userSessions.set(socket.id, { socket, questions, currentIndex: 0, userId });
        yield redis.set(`interview:${userId}:answers`, JSON.stringify([]));
        socket.emit("receiveQuestion", questions[0]);
    }));
    socket.on("saveAnswer", (_a) => __awaiter(void 0, [_a], void 0, function* ({ question, answer }) {
        const session = userSessions.get(socket.id);
        if (!session)
            return;
        const key = `interview:${session.userId}:answers`;
        const storedAnswers = JSON.parse((yield redis.get(key)) || "[]");
        storedAnswers.push({ question, answer });
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
    socket.on("submitInterview", () => __awaiter(void 0, void 0, void 0, function* () {
        const session = userSessions.get(socket.id);
        if (!session)
            return;
        const key = `interview:${session.userId}:answers`;
        const answers = JSON.parse((yield redis.get(key)) || "[]");
        if (answers.length > 0) {
            yield InterviewModel_1.default.create({ userId: session.userId, answers });
            yield redis.del(key);
            socket.emit("submissionSuccess", "Interview saved!");
        }
    }));
    socket.on("disconnect", () => {
        userSessions.delete(socket.id);
    });
});
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
