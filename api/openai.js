/// <reference types="node" />

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: globalThis.process.env.OPEN_AI,
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
        console.log(req.body);
        const messages = req.body.messages;
        const zod_format=req.body.zod_format;
        console.log("Messages: "+messages);
        console.log("Zod format: "+zod_format);

        /*return res.status(400).json({
            error:"Just testing"
        });*/

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
            format: zod_format,
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