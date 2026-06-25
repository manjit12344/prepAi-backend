import config,{prisma} from "../config/config.js"
import OpenAI from "openai";
import PDFParser from "pdf-parser";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: config.deepseek_api_key,
});




async function formattingPdf(url){

}


async function main(resumeURL) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `
        You are an expert ATS scanner and technical recruiter.
        
        ${resumeURL} is the resume url.

        Return ONLY valid JSON.

              {
        "atsScore": number,
        "strengths": [],
        "weaknesses": [],
        "suggestions": []
      }
        
        ` }],
    model: "deepseek-v4-pro",
    thinking: {"type": "enabled"},
    reasoning_effort: "high",
    stream: false,
  });

  return completion.choices[0].message.content;
}

