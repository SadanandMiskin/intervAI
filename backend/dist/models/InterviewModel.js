"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const InterviewSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("Interview", InterviewSchema);
