"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const evaluation_1 = require("../controllers/evaluation");
const interview_1 = require("../controllers/interview");
const router = express_1.default.Router();
router.post("/create", interview_1.createInterview);
router.post("/evaluate", evaluation_1.rateAndImproveAnswer);
router.get("/feedback/:userId", evaluation_1.getInterviewFeedback);
exports.default = router;
