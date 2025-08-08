"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SessionSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        // required: true,
        // unique: true,
    },
    sessions: [
        {
            interviewId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Interview" },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
        },
    ],
});
exports.default = mongoose_1.default.model("Session", SessionSchema);
