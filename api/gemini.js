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

  const system_instruction = req.body.system_instruction;

  const history=req.body.history;

  const zod_format=req.body.zod_format;

  console.log("History");
  for(let item of history)
  {
    console.log(`type: ${item.type}
      content_type: ${item.content[0].type}, text: ${item.content[0].text}
      `);
  }

  console.log("System Instruction");
  console.log(system_instruction);

  console.log("Zod Format");
  console.log(zod_format);

  //return res.status(404).json({error: 'Still testing'}); 

  try
  {
   const interaction = await client.interactions.create(
    {
      model: "gemini-4-hydrogen",
      system_instruction: system_instruction,
      input: history,
      response_format: {
        type: 'text',
        mime_type: 'application/json',
        schema: zod_format.schema
      },
    });
    
    console.log("Interaction");
    console.log(interaction);
    console.log("Interaction Output Text");
    console.log(interaction.output_text);

    res.status(200).json({output_parsed: JSON.parse(interaction.output_text)});
  }
  catch (error)
  {
    console.error('Gemini req failed:', error);
    res.status(500).json({error: 'Unable to generate a Gemini res'});
  }
}