/// <reference types="node" />

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const client = new OpenAI({
  apiKey: globalThis.process.env.OPEN_AI,
});

const OutputStructure = z.object({
  score: z.number().describe("A rating integer strictly between 1 and 10 inclusive."),
  feedback: z.string().describe("Feedback on the person's answer"),
});

export default async function handler(req, res) 
{
    if (req.method !== "POST") 
    {
        req.status(405).json({
        error: "Method not allowed",
        });
    }

    try 
    {
        const messages = req.body.messages;
        

        if (!messages) 
        {
        return res.status(400).json({
            error: "Missing prompt",
        });
        }

        const ai_output = await client.responses.parse({
        model: "gpt-6.1-terra",
        input: messages,
        text: {
            format: zodTextFormat(OutputStructure, "feedback"),
        },
        });

        console.log(ai_output.output_parsed);
        res.status(200).json({
            output_parsed: (ai_output.output_parsed),
        });
    } 
    catch (error) 
    {
        console.error(error);

        res.status(500).json({
        error: "Failed to contact OpenAI",
        });
    }
}