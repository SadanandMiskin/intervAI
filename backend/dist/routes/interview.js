"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interv_1 = require("../controllers/interv");
const r = express_1.default.Router();
r.post('/create', (req, res, next) => {
    try {
        (0, interv_1.createInterv)(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.default = r;
