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
    setMode("interview");
    setQuery(new_query);
  }
  const [mode,setMode]=useState("setup");
  const [query,setQuery]=useState("Give me a practice interivew for a Entry level Front End position. The company is a Small company and this is the Phone Screening interview. Ask me one question at a time.");

  if(mode=="setup")
  {
    return (
      <>
        <h1>Interview Practice</h1>
        <SetupInterview toInterview={toInterview}></SetupInterview>
      </>
    );
  }
  else if(mode=="interview")
  {
    return (
      <>
        <h1>Interview Practice</h1>
        <Interview query={query}></Interview>
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
