import { Request, Response } from "express";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";
import Redis from "ioredis";

const redis = new Redis({
  host: 'redis',
  port: 6379
});

const llm = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
  apiKey: process.env.FIREWORKS_API_KEY,
});

export async function evaluateAnswer(question: string, answer: string) {
  // const prompt =

  const aiMsg = await llm.invoke( [
    [
"system",
`You are an expert AI interviewer. Evaluate the candidate's answer for correctness, depth, and clarity.
Respond only in strict minified JSON format using double quotes for keys and string values.
Format: { "rating": number, "improvedAnswer": string }
If the answer is already correct and doesn't need any improvements, set "improvedAnswer" to "NA".
Do not include any extra explanation, text, or formatting. Only return valid JSON in one line.`

    ],
    ["human", `Question: ${question}\nAnswer: ${answer}`],
  ]);
  const responseText = String(aiMsg.content);
  // console.log(aiMsg.content)
  try {
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error parsing evaluation response:", error);
    return { rating: 0, improvedAnswer: answer };
  }
}

export async function rateAndImproveAnswer(req: Request, res: Response) {
  const { userId, question, answer } = req.body;
  if (!userId || !question || !answer) {
     res.status(400).json({ error: "Invalid input" });
  }

  const { rating, improvedAnswer } = await evaluateAnswer(question, answer);
  const key = `interview:${userId}:answers`;
  const storedAnswers = JSON.parse((await redis.get(key)) || "[]");

  storedAnswers.push({ question, originalAnswer: answer, improvedAnswer, rating });
  await redis.set(key, JSON.stringify(storedAnswers));

  res.json({ rating, improvedAnswer });
}

export async function getInterviewFeedback(req: Request, res: Response) {
  const { userId } = req.params;
  const key = `interview:${userId}:answers`;

  const answers = JSON.parse((await redis.get(key)) || "[]");
  res.json({ feedback: answers });
}
