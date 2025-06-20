import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {read_text_file,read_excel_file} from './read_files.js'

function SetupInterview(props) 
{
    const toInterview=props.toInterview;

    function handleRole(e)
    {
        const temp_value=e.target.value;
        setRole(temp_value);
    }

    function handleCompanySize(e)
    {
        const temp_value=e.target.value;
        setCompanySize(temp_value);
    }
    function handleScenario(e)
    {
        const temp_value=e.target.value;
        setScenario(temp_value);
    }
    function handleLevel(e)
    {
        const temp_value=e.target.value;
        setLevel(temp_value);
    }
    function handleRequiredExperience(e)
    {
        const temp_value=e.target.value;
        setRequiredExperience(temp_value);
    }
    function submitQuery()
    {
        let query_temp="";
        if(props.question_type=="interview")
        {
            query_temp=`Give me a practice interivew for a ${level} level ${role} position.\n`;
            query_temp+=`The company is a ${company_size} company and this is the ${scenario} interview. Ask me one question at a time.`;
        }
        else
        {
            query_temp=`Give me customer service scenarios for a ${level} level ${role} position.\n`;
            query_temp+=`The company is a ${company_size} company. Give me one scenario at a time.`;
        }
        setQuery(query_temp);
        console.log(query_temp);
        console.log(`${role} ${company_size} ${scenario}`);

        toInterview(query_temp);
    }

    const [role, setRole] = useState("");

    //Small, Medium, Large
    const [company_size,setCompanySize]=useState("Small");

    //Phone Screening, Behavioral Interview, Technical Questions, Final Round
    const [scenario,setScenario]=useState("Phone Screening");

    const names=["Zala","Jackie","Taavi","Ladislava","Osiris","Tracy","Jennings","Denton","Tatjana","Agathon","Jonathan"];

    const [query,setQuery]=useState("");

    const [level,setLevel]=useState("Entry");
    
    const [required_experience,setRequiredExperience]=useState("*");

    const [role_options,setRoleOptions]=useState();

    useEffect(()=>
    {
        read_excel_file("./Career_Info_V3.xlsx").then((roles)=>
        {
            if(required_experience!="*")
            {
                roles=roles.filter(role=>role["Typical Education Level"]==required_experience);
            }

            roles.sort((a,b) => a.Occupation.localeCompare(b.Occupation));
            console.log(roles);
            const role_options_temp=roles.map(role=><option value={role.Occupation} key={role.Occupation}>{role.Occupation}</option>);
            setRoleOptions(role_options_temp);
        });
    },[required_experience]);

    return (
    <>
    <h2>Settings</h2>
    <label htmlFor="question_type">Set Question Type</label>
    <select id="question_type" value={props.question_type} onChange={props.handleQuestionType} className="block">
    <option value="customer_service_scenario">Customer Service Scenario</option>
    <option value="interview_question">Interview Question</option>
    </select>

    <label htmlFor="required_experience">Required Experience</label>
    <select id="required_experience" value={required_experience} onChange={handleRequiredExperience} className="block">
    <option value="*">Any</option>
    <option value={1}>No formal educational credential</option>
    <option value={2}>High school diploma or equivalent</option>
    <option value={3}>Some college, no degree
</option>
    <option value={4}>Associate's degree
</option>
    <option value={5}>Bachelor's degree
</option>
    <option value={6}>Master's degree
</option>
    <option value={7}>Doctoral or professional degree
</option>
    </select>

    <label htmlFor="role">Role:</label>
    <input id="role" list="roles" value={role} onChange={handleRole} className="block"></input>
    
    <datalist id="roles">
    {role_options}
    </datalist>

    <label htmlFor="level">Level:</label>
    <select id="level" value={role} onChange={handleLevel} className="block">
    <option value="Entry">Entry Level</option>
    <option value="Mid">Mid Level</option>
    <option value="Senior">Senior Level</option>
    </select>

    <label htmlFor="company_size">Company Size:</label>
    <select id="company_size" value={company_size} onChange={handleCompanySize} className="block">
    <option value="Small">Small</option>
    <option value="Medium">Medium</option>
    <option value="Large">Large</option>
    </select>

    <label htmlFor="scenario">Secnario:</label>
    <select id="scenario" value={scenario} onChange={handleScenario} className="block">
    <option value="Phone Screening">Phone Screening</option>
    <option value="Behavioral Interview">Behavioral Interview</option>
    <option value="Technical Questions">Technical Questions</option>
    <option value="Final Round">Final Round</option>
    </select>

    <button onClick={submitQuery}>Submit</button>
    <div>
    {query}
    </div>
    </>
  )
}

export default SetupInterview;
