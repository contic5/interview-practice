/// <reference types="node" />

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: globalThis.process.env.OPEN_AI,
});

export default async function handler(req, res) 
{
    if (req.method !== "POST") 
    {
        return req.status(405).json({
        error: "Method not allowed",
        });
    }

    try 
    {
        const { prompt } = req.body;

        if (!prompt) {
        return res.status(400).json({
            error: "Missing prompt",
        });
        }

        const res = await client.ress.create({
        model: "gpt-5-mini",
        input: prompt,
        });

        res.status(200).json({
        res: res.output_text,
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