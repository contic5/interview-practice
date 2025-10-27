import { useEffect,useState } from 'react'
import { GoogleGenAI } from "@google/genai";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
const OPEN_AI_KEY=import.meta.env.VITE_OPEN_AI;
const GOOGLE_GEMINI_KEY=import.meta.env.VITE_GOOGLE_GEMINI;
const running_queries=true;

console.log(GOOGLE_GEMINI_KEY);
const ai = new GoogleGenAI({apiKey:GOOGLE_GEMINI_KEY});
const ai_role_name="model";

function Interview(props)
{
  const question_type=props.question_type;
  
  async function get_chatgpt_response(messages)
  {
    console.log(messages);
    if(!running_queries)
    {
      return `QUERIES ARE OFF: ${JSON.stringify(messages)}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPEN_AI_KEY
      },
      body: JSON.stringify({
        model: "gpt-4.1-nano",
        messages: messages
      })
    });
    console.log(response);

    const data = await response.json();
    const chatGPTMesage = data.choices[0].message;
    //setMessages([...updatedMessages, assistantReply]);
    return chatGPTMesage.content;
  }
  async function get_gemini_response(messages)
  {
      let history=[];
      for (let i=0;i<messages.length-1;i++)
      {
        history.push({role:messages[i].role,parts:[{text:messages[i].content}]});
      }
      const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: history
    });

    const response = await chat.sendMessage(
    {
      message:messages[messages.length-1].content
    });

    return response.text;
  }
  function find_score(new_response)
  {
    if(!running_queries)
    {
      return -1;
    }

    let words=new_response.split(" ");
    words=words.reverse();
    for(let word of words)
    {
      if(word.includes("/"))
      {
        const parts=word.split("/");
        console.log(`Score: ${parts}`);
        return parseInt(parts[0]);
      }
    }
    return -1;
  }
  async function submitInput()
  {
    try 
    {
      const system_response_message= {role:ai_role_name,content:system_response_content};
      const interview_message={role:'user',content:interview_message_content};

      let user_answer_message_content="";
      let user_answer_message={};
      if(question_type=="interview_question")
      {
        user_answer_message = { role: 'user', content: `You asked me ${chat_gpt_question} My answer was ${user_answer}. Write the score on the last line as X/10. Do not ask another question.` };
      }
      else
      {
        user_answer_message = { role: 'user', content: `You asked me ${chat_gpt_question} My answer was ${user_answer}. Write the score on the last line as X/10. Do not give me another scenario.` };
      }
      let messages=[system_response_message,interview_message,user_answer_message];
      console.log(messages);
      const new_response=await get_gemini_response(messages);
      setChatGPTResponse(new_response);

      const score=find_score(new_response);
      setScores(scores=>[...scores,score]);

      const system_generation_message= {role:ai_role_name,content:system_question_generation_content};
      const new_question_message={role:'user',content:`${interview_message_content}`};
      messages=[system_generation_message,new_question_message];
      const new_question=await get_gemini_response(messages);
      setChatGPTQuestion(new_question);

      if(!running_queries)
      {
        console.log("Queries are not running right now. This saves money and is good for testing. If you want to see queries, turn queries back on.");
      }
    } 
    catch (error) 
    {
      console.error('Error:', error);
    }
  }
  function handleInput(e)
  {
    const new_user_answer=e.target.value;
    setUserAnswer(new_user_answer);
  }

  let system_response_content="You are an interviewing tool. Make sure to give helpful questions.";
  let system_question_generation_content="You are an interviewing tool. Make sure to give helpful questions. I already answered one question.";
  if(question_type=="customer_service_scenario")
  {
    system_response_content="You are an interviewing tool. Make sure to give helpful customer service scenarios.";
    system_question_generation_content="You are an interviewing tool. Make sure to give helpful customer service scenarios.";
  }

  const interview_message_content=props.query;

  const [user_answer,setUserAnswer]=useState("");
  const [chatgpt_response,setChatGPTResponse]=useState("After you give your answer, ChatGPT will respond.");
  const [chat_gpt_question,setChatGPTQuestion]=useState("Why are you interested in the position?");
  useEffect(()=>
  {
      if(question_type=="interview_question")
      {
        setChatGPTQuestion("Why are you interested in the position");
      }
      else
      {
        setChatGPTQuestion("How would you first talk with a new customer or client?")
      }
  },[question_type]);

  const [scores,setScores]=useState([]);

  const score_elements=scores.map((score,index)=><p key={index}>{score}/10</p>);

  return(
  <>
  <h2>Interview</h2>
  <button onClick={()=>props.switch_mode("setup")}>Change Interview Settings</button>
  <h3>ChatGPT Response</h3>
  <p>{chatgpt_response}</p>
  <h3>ChatGPT Question</h3>
  <p>{chat_gpt_question}</p>
  <h3>Your Answer</h3>
  <textarea id="user_answer" onChange={handleInput} value={user_answer} rows="8" cols="50">
  </textarea><br></br>
  <button onClick={submitInput}>Submit</button>
  <h3>Query</h3>
  <p>{system_question_generation_content}</p>
  <p>{interview_message_content}</p>

  <h3>Scores</h3>
  <div>
  {score_elements}
  </div>
  </>
  );
}

export default Interview;