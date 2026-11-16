/// <reference types="node" />

import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({
    apiKey: globalThis.process.env.GOOGLE_GEMINI_KEY,
});

export default async function handler(req, res)
{
  if (req.method !== 'POST')
  {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const messages = req.body.messages;
  const zod_format=req.body.zod_format;

  try
  {
   const interaction = await client.interactions.create(
    {
      model: "gemini-4-hydrogen",
      input: messages,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: zod_format
      },
    });
    res.status(200).json({output_parsed: zod_format.parse(JSON.parse(interaction.output_text))});
  }
  catch (error)
  {
    console.error('Gemini req failed:', error);
    res.status(500).json({error: 'Unable to generate a Gemini res'});
  }
}