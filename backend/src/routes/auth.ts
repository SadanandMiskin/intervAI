import express, { Request, Response, NextFunction } from 'express';
// import * as authController from '../controllers/authController';
import { googleSignIn } from '../controllers/googleSignin';

const router = express.Router();

// router.post('/register', (req: Request, res: Response, next: NextFunction) => {
//   authController.register(req, res).catch(next);
// });

// router.post('/login', (req: Request, res: Response, next: NextFunction) => {
//   authController.login(req, res).catch(next);
// });
router.post('/google', googleSignIn);

export default router;