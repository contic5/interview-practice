import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SetupInterview from './SetupInterview'
import Interview from './Interview'

function App() 
{
  function toInterview(new_query)
  {
    console.log(`New Query is ${new_query}`)
    switch_mode("interview");
    setQuery(new_query);
  }
  function switch_mode(new_mode)
  {
    setMode(new_mode);
  }
  function handleQuestionType(e)
  {
    const new_question_type=e.target.value;
    setQuestionType(new_question_type);
    console.log(new_question_type);
  }
  const [mode,setMode]=useState("setup");
  const [question_type,setQuestionType]=useState("customer_service_scenario");
  const [query,setQuery]=useState("Give me a practice interivew for a Entry level Front End position. The company is a Small company and this is the Phone Screening interview. Ask me one question at a time.");

  if(mode=="setup")
  {
    return (
      <>
        <h1>Interview Practice</h1>
        <SetupInterview toInterview={toInterview} switch_mode={switch_mode} handleQuestionType={handleQuestionType} question_type={question_type}></SetupInterview>
      </>
    );
  }
  else if(mode=="interview")
  {
    return (
      <>
        <h1>Interview Practice</h1>
        <Interview query={query} question_type={question_type} switch_mode={switch_mode}></Interview>
      </>
    );
  }
  else
  {
    return (
      <>
        <h1>Interview Practice</h1>
        <p>ERROR: Incorrect Interview Mode</p>
      </>
    );
  }
}

export default App;
