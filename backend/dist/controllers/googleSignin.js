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
exports.googleSignIn = void 0;
const google_auth_library_1 = require("google-auth-library");
const InterviewModel_1 = __importDefault(require("../models/InterviewModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import bcrypt from 'bcryptjs';
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const googleSignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            res.status(400).json({ error: 'Invalid Google token' });
            return;
        }
        const { email, name, sub: googleId } = payload;
        let user = yield InterviewModel_1.default.findOne({ email });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-8);
            // const hashedPassword = await bcrypt.hash(randomPassword, 10);
            user = yield InterviewModel_1.default.create({
                username: (name === null || name === void 0 ? void 0 : name.replace(/\s+/g, '').toLowerCase()) || email.split('@')[0],
                email,
                // password: hashedPassword,
                googleId,
            });
        }
        const jwtToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        console.log(user);
        res.json({
            token: jwtToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                answers: user.answers
            },
        });
    }
    catch (error) {
        console.error('Google sign-in error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});
exports.googleSignIn = googleSignIn;
