import { Request, Response } from "express";
import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const llm = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,
});

class Interview {
  private jd: string;
  constructor(jd: string) {
    this.jd = jd;
  }

  public async generateQuestions() {
    const aiMsg = await llm.invoke([
      [
        "system",
        "You are an expert technical interviewer. Based on the given Job Description (JD), generate 3 high-quality theoretical questions that focus on practical application and real-world usage of the technologies mentioned in the JD. Questions should range from easy to hard and test the candidate’s understanding, decision-making, and best practices rather than coding. Return the output in pure JSON format only, with no additional text or explanations. The structure should be: [{type: easy/medium/hard,  question: '' , topics: []}]. Ensure the questions are JD-specific and avoid generic theoretical ones."
      ],
      ["human", this.jd],
    ]);

    const responseText = String(aiMsg.content);

    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  }
}

export async function createInterview(req: Request, res: Response) {
  const { jd } = req.body;
  if (!jd) {
     res.status(400).json({ error: "Job Description is required" });
  }

  const interview = new Interview(jd);
  const questions = await interview.generateQuestions();

  if (questions) {
    res.json({ questions });
  } else {
    res.status(500).json({ error: "Failed to generate questions" });
  }
}

export async function getInterviewQuestions(jd: string) {
  const interview = new Interview(jd);
  return await interview.generateQuestions();
}
