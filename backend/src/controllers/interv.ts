import { json, NextFunction, Request, Response } from "express";

import { ChatFireworks } from "@langchain/community/chat_models/fireworks";

const llm = new ChatFireworks({
  model: "accounts/fireworks/models/llama-v3p1-70b-instruct",
  temperature: 0,
  maxTokens: undefined,
  timeout: undefined,
  maxRetries: 2,

});


class interv{
  private jd: string;
  constructor(jd: string) {
    this.jd = jd
  }
  public printjd() {
    return this.jd
  }

//   public async getIntervQuestion() {
//     const aiMsg = await llm.invoke([
//       [
//         "system",
//        "You are an expert technical interviewer. Based on the given Job Description (JD), generate 10 high-quality theoretical questions that focus on practical application and real-world usage of the technologies mentioned in the JD. Questions should range from easy to hard and test the candidate’s understanding, decision-making, and best practices rather than coding. Return the output in pure JSON format only, with no additional text or explanations. The structure should be: [{type: easy/medium/hard,  question: ''}], Ensure the questions are JD-specific and avoid generic theoretical ones"
//       ],
//       ["human", this.jd],
//     ]);
//     const cleanedJsonString = aiMsg.replace(/\n/g, "").replace(/\\"/g, '"');
// const jsonData = JSON.parse(cleanedJsonString);

// console.log(jsonData);
// return jsonData
//   }

  public async getIntervQuestion() {
    const aiMsg = await llm.invoke([
      ["system",

     "You are an expert technical interviewer. Based on the given Job Description (JD), generate 10 high-quality theoretical questions that focus on practical application and real-world usage of the technologies mentioned in the JD. Questions should range from easy to hard and test the candidate’s understanding, decision-making, and best practices rather than coding. Return the output in pure JSON format only, with no additional text or explanations. The structure should be: [{type: easy/medium/hard,  question: '' , topics: []}], Ensure the questions are JD-specific and avoid generic theoretical ones"

      ],
      ["human", this.jd]
    ]);

    const responseText = String(aiMsg.content);


    try {
        const jsonData = JSON.parse(responseText);
        return jsonData;
    } catch (error) {
        console.error("Error parsing JSON:", error);
        return null;
    }
}

}



export async function createInterv(req: Request, res: Response, next: NextFunction) {
  const {jd} = req.body
  const itr = new interv(jd)
  const r = await itr.getIntervQuestion()
  res.json(r)
  // res.json(itr.getIntervQuestion())

}