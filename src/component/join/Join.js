import React, { useState } from 'react'
import "./Join.css"
import chaticon from "../../images/chaticon.png";
import { Link } from 'react-router-dom';

let user;
const senduser=()=>{
    user = document.getElementById('inputjoin').value;
    document.getElementById.value="";
   }

const Join = () => {
    const [name, setname] = useState("");
  
   

  return (
    <div className="joinpage">
        <div className="joincontainer">
          
            <img src={chaticon} alt='logo'></img>
           <h1>Log in to Flow Chat</h1>
           <input onChange={(e)=>setname(e.target.value)} id="inputjoin"type="email" placeholder="Enter your Name"/>
           
           <Link onClick={(event)=>!name?event.preventDefault():null} to="/chat"><button onClick={senduser} className='joinbtn'>LOG IN</button></Link>
        </div>
      
    </div>
  )
}

export default Join
export{user} ;