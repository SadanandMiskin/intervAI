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
exports.evaluateAnswer = evaluateAnswer;
exports.rateAndImproveAnswer = rateAndImproveAnswer;
exports.getInterviewFeedback = getInterviewFeedback;
const fireworks_1 = require("@langchain/community/chat_models/fireworks");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
const llm = new fireworks_1.ChatFireworks({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
});
function evaluateAnswer(question, answer) {
    return __awaiter(this, void 0, void 0, function* () {
        // const prompt =
        const aiMsg = yield llm.invoke([
            [
                "system",
                `You are an expert AI interviewer. Evaluate the answer for correctness, depth, and clarity.
       Give a rating from 1 to 10 and suggest improvements if necessary.
       Return JSON format: { rating: number, improvedAnswer: string } only, noo need of extra writing`,
            ],
            ["human", `Question: ${question}\nAnswer: ${answer}`],
        ]);
        const responseText = String(aiMsg.content);
        console.log(aiMsg.content);
        try {
            return JSON.parse(responseText);
        }
        catch (error) {
            console.error("Error parsing evaluation response:", error);
            return { rating: 0, improvedAnswer: answer };
        }
    });
}
function rateAndImproveAnswer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, question, answer } = req.body;
        if (!userId || !question || !answer) {
            res.status(400).json({ error: "Invalid input" });
        }
        const { rating, improvedAnswer } = yield evaluateAnswer(question, answer);
        const key = `interview:${userId}:answers`;
        const storedAnswers = JSON.parse((yield redis.get(key)) || "[]");
        storedAnswers.push({ question, originalAnswer: answer, improvedAnswer, rating });
        yield redis.set(key, JSON.stringify(storedAnswers));
        res.json({ rating, improvedAnswer });
    });
}
function getInterviewFeedback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const key = `interview:${userId}:answers`;
        const answers = JSON.parse((yield redis.get(key)) || "[]");
        res.json({ feedback: answers });
    });
}
