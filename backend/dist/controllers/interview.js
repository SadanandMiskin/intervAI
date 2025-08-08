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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInterview = createInterview;
exports.getInterviewQuestions = getInterviewQuestions;
const fireworks_1 = require("@langchain/community/chat_models/fireworks");
const fireworksKey = process.env.FIREWORKS_API_KEY;
const llm = new fireworks_1.ChatFireworks({
    model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
    temperature: 0,
    maxTokens: undefined,
    timeout: undefined,
    maxRetries: 2,
    apiKey: fireworksKey
});
class Interview {
    constructor(jd) {
        this.jd = jd;
    }
    generateQuestions() {
        return __awaiter(this, void 0, void 0, function* () {
            const aiMsg = yield llm.invoke([
                [
                    "system",
                    "You are an expert technical interviewer. Based on the given Job Description (JD), generate 9-10 high-quality theoretical questions that focus on practical application and real-world usage of the technologies mentioned in the JD. Questions should range from easy to hard and test the candidate’s understanding, decision-making, and best practices rather than coding. Return the output in pure JSON format only, with no additional text or explanations. The structure should be: [{type: easy/medium/hard,  question: '' , topics: []}]. Ensure the questions are JD-specific and avoid generic ones. Ask question only theorotical non coding based."
                ],
                ["human", this.jd],
            ]);
            const responseText = String(aiMsg.content);
            try {
                return JSON.parse(responseText);
            }
            catch (error) {
                console.error("Error parsing JSON:", error);
                return null;
            }
        });
    }
}
function createInterview(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jd } = req.body;
        if (!jd) {
            res.status(400).json({ error: "Job Description is required" });
        }
        const interview = new Interview(jd);
        const questions = yield interview.generateQuestions();
        if (questions) {
            res.json({ questions });
        }
        else {
            res.status(500).json({ error: "Failed to generate questions" });
        }
    });
}
function getInterviewQuestions(jd) {
    return __awaiter(this, void 0, void 0, function* () {
        const interview = new Interview(jd);
        return yield interview.generateQuestions();
    });
}
