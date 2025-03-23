import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/InterviewModel';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
       res.status(400).json({ error: 'Invalid Google token' });
       return
    }

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      // const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        username: name?.replace(/\s+/g, '').toLowerCase() || email.split('@')[0],
        email,
        // password: hashedPassword,
        googleId,
      });
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });


    // console.log(user)

    res.json({
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        answers: user.answers
      },
    });
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};