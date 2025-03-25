"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import * as authController from '../controllers/authController';
const googleSignin_1 = require("../controllers/googleSignin");
const router = express_1.default.Router();
// router.post('/register', (req: Request, res: Response, next: NextFunction) => {
//   authController.register(req, res).catch(next);
// });
// router.post('/login', (req: Request, res: Response, next: NextFunction) => {
//   authController.login(req, res).catch(next);
// });
router.post('/google', googleSignin_1.googleSignIn);
exports.default = router;
