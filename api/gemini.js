/// <reference types="node" />

import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res)
{
  if (req.method !== 'POST')
  {
    return res.status(405).json({error: 'Method not allowed'});
  }

  const {history, message} = req.body ?? {};
  if (!Array.isArray(history) || typeof message !== 'string' || message.length === 0)
  {
    return res.status(400).json({error: 'A history array and message are required'});
  }

  try
  {
    const googleAI = new GoogleGenAI({apiKey: globalThis.process.env.GOOGLE_GEMINI});
    const chat = googleAI.chats.create({
      model: 'gemini-3.6-flash',
      history: history
    });
    const result = await chat.sendMessage({message: message});

    res.status(200).json({text: result.text});
  }
  catch (error)
  {
    console.error('Gemini req failed:', error);
    res.status(500).json({error: 'Unable to generate a Gemini res'});
  }
}