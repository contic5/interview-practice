import { useEffect,useState } from 'react'
import { GoogleGenAI } from "@google/genai";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/// <reference types="node" />

//Keys for Open_AI and Google Gemini
const OPEN_AI_KEY=process.env.OPEN_AI;
const GOOGLE_GEMINI_KEY=process.env.GOOGLE_GEMINI;

//If false, the Interview System does not run queries.
const running_queries=true;

//Main AI can be gemini or chatgpt
const main_ai="gemini";
let ai_role_name="system";
if(main_ai=="gemini")
{
  ai_role_name="model";
}

console.log(GOOGLE_GEMINI_KEY);
const google_ai = new GoogleGenAI({apiKey:GOOGLE_GEMINI_KEY});



function Interview(props)
{
  const question_type=props.question_type;

  //Respond to interview question
  let system_response_content="You are an interviewing tool. Make sure to give helpful questions.";

  //Generate new question
  let system_question_generation_content="You are an interviewing tool. Make sure to give helpful questions. I already answered one question.";
  if(question_type=="customer_service_scenario")
  {
    system_response_content="You are an interviewing tool. Make sure to give helpful customer service scenarios.";
    system_question_generation_content="You are an interviewing tool. Make sure to give helpful customer service scenarios. I already answered for one scenario.";
  }

  const ai_context_query=props.ai_context_query;

  const [user_answer,setUserAnswer]=useState("");
  const [ai_response,setChatGPTResponse]=useState("");
  const [ai_question,setChatGPTQuestion]=useState("");

  const [timer_speed,setTimerSpeed]=useState(10);
  useEffect(()=>
  {
    let new_question="";
    if(question_type=="interview_question")
    {
      new_question="Why are you interested in the position";
    }
    else
    {
      new_question="How would you first talk with a new customer or client?";
    }
    gradual_display_info("After you give your answer, ChatGPT will respond.",new_question,0,0);
  },[question_type]);

  const [scores,setScores]=useState([]);

  const score_elements=scores.map((score,index)=><p key={index}>{score}/10</p>);
  
  async function get_ai_response(messages)
  {
    console.log(messages);
    //Return blank message if we are not running queries
    if(!running_queries)
    {
      return `QUERIES ARE OFF: ${JSON.stringify(messages)}`;
    }

    //Get query from ChatGPT
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + OPEN_AI_KEY
      },
      body: JSON.stringify({
        model: "gpt-5-nano",
        messages: messages
      })
    });
    console.log(response);

    //Choose the first response.
    const data = await response.json();
    const chatGPTMesage = data.choices[0].message;
    //setMessages([...updatedMessages, assistantReply]);
    return chatGPTMesage.content;
  }
  async function get_gemini_response(messages)
  {
      //Convert ChatGPT message history format to gemini message history format.
      let history=[];
      for (let i=0;i<messages.length-1;i++)
      {
        history.push({role:messages[i].role,parts:[{text:messages[i].content}]});
      }
      const chat = google_ai.chats.create({
      model: "gemini-2.5-flash",
      history: history
      });

    //Get first response
    const response = await chat.sendMessage(
    {
      message:messages[messages.length-1].content
    });

    return response.text;
  }
  function find_score(new_response)
  {
    //If we are not running queries, return -1
    if(!running_queries)
    {
      return -1;
    }

    let words=new_response.split(" ");
    words=words.reverse();
    //Find the last word that contains a /. That would be the word with X/10.
    for(let word of words)
    {
      if(word.includes("/"))
      {
        const parts=word.split("/");
        //By taking the first part of X/10, we get the score.
        console.log(`Score: ${parts}`);
        return parseInt(parts[0]);
      }
    }
    return -1;
  }
  function gradual_display_info(new_ai_response,new_question,new_ai_response_index,new_question_index)
  {
    if(new_ai_response_index<new_ai_response.length)
    {
      new_ai_response_index+=1;
      setChatGPTResponse(new_ai_response.substring(0,new_ai_response_index));
      setTimeout(()=>gradual_display_info(new_ai_response,new_question,new_ai_response_index,new_question_index),timer_speed);
    }
    else if(new_question_index<new_question.length)
    {
      new_question_index+=1;
      setChatGPTQuestion(new_question.substring(0,new_question_index));
      setTimeout(()=>gradual_display_info(new_ai_response,new_question,new_ai_response_index,new_question_index),timer_speed);
    }
    else
    {

    }
  }
  async function handle_response(new_ai_response)
  {
    //setChatGPTResponse(new_ai_response);

    //Find the score in the generative AI response
    const score=find_score(new_ai_response);
    setScores(scores=>[...scores,score]);

    //Message telling the AI that it does interviews.
    const system_generation_message= {role:ai_role_name,content:system_question_generation_content};

    //User message asking for new interview question.
    const new_question_message={role:'user',content:`${ai_context_query}`};
    const messages=[system_generation_message,new_question_message];
    const new_question=await get_gemini_response(messages);
    //setChatGPTQuestion(new_question);

    setTimeout(()=>gradual_display_info(new_ai_response,new_question,0,0))
    if(!running_queries)
    {
      console.log("Queries are not running right now. This saves money and is good for testing. If you want to see queries, turn queries back on.");
    }
  }
  async function submitInput()
  {
    try 
    {
      //Framing so the interviewer AI responds to the question and does NOT GIVE ANOTHER QUESTION
      const system_response_message= {role:ai_role_name,content:system_response_content};

      //???
      const interview_message={role:'user',content:ai_context_query};

      let user_answer_message={};
      //If we are asking interview questions, then give an interview question
      if(question_type=="interview_question")
      {
        user_answer_message = { role: 'user', content: `You asked me ${ai_question} My answer was ${user_answer}. Write the score on the last line as X/10. Do not ask another question. Only give me your feedback.` };
      }
      //Otherwise, give a scenario.
      else
      {
        user_answer_message = { role: 'user', content: `You asked me ${ai_question} My answer was ${user_answer}. Write the score on the last line as X/10. Do not give me another scenario. Only give me your feedback.` };
      }

      //Store the question the interviewer asked, 
      let messages=[system_response_message,interview_message,user_answer_message];
      console.log(messages);

      //Get response from ChatGPT or Google Gemini
      let new_ai_response="";
      if(main_ai=="chatgpt")
      {
        new_ai_response=await get_ai_response(messages);
      }
      else
      {
        new_ai_response=await get_gemini_response(messages);
      }
      handle_response(new_ai_response);
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
  function handleTimeSpeed(e)
  {
    const new_timer_speed=e.target.value;
    setTimerSpeed(new_timer_speed);
  }

  return(
  <>
  <h2>Interview</h2>
  <button onClick={()=>props.switch_mode("setup")}>Change Interview Settings</button>
  <h3>Interview Settings</h3>
  <div>
  <label htmlFor="timer_speed">Timer Speed:{timer_speed}</label>
  <input id="timer_speed" value={timer_speed} onChange={handleTimeSpeed} type="range" min={1} max={100}></input>
  </div>
  <h3>ChatGPT Response</h3>
  <p>{ai_response}</p>
  <h3>ChatGPT Question</h3>
  <p>{ai_question}</p>
  <h3>Your Answer</h3>
  <textarea id="user_answer" onChange={handleInput} value={user_answer} rows="8" cols="50">
  </textarea><br></br>
  <button onClick={submitInput}>Submit</button>
  <h3>Query</h3>
  <p>{system_question_generation_content}</p>
  <p>{ai_context_query}</p>

  <h3>Scores</h3>
  <div>
  {score_elements}
  </div>
  </>
  );
}

export default Interview;