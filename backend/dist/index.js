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
const interview_1 = require("./controllers/interview"); // Assuming this generates LLM questions
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
const userSessions = new Map();
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("sendjd", (jd) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Received JD:", jd);
        const questions = yield (0, interview_1.getInterviewQuestions)(jd); // Get questions from LLM
        if (!questions || questions.length === 0)
            return;
        userSessions.set(socket.id, {
            socket,
            questions,
            currentIndex: 0,
        });
        // Send the first question
        socket.emit("receiveQuestion", questions[0]);
    }));
    socket.on("nextQuestion", () => {
        const session = userSessions.get(socket.id);
        if (!session)
            return;
        session.currentIndex++;
        if (session.currentIndex < session.questions.length) {
            session.socket.emit("receiveQuestion", session.questions[session.currentIndex]);
        }
        else {
            session.socket.emit("receiveQuestion", { question: "No more questions available." });
        }
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        userSessions.delete(socket.id);
    });
});
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
