import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Login({ setAuthenticated }) {
    const navigate = useNavigate();
    const [email, setUseremail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleLogin = async () => {
      try {
        const response = await fetch("http://localhost:1337/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.message === "Inloggningen lyckades") {
            console.log("Inloggningen lyckades");
            setAuthenticated(true); 
            navigate('/main')
          } else {
            console.error("Fel vid inloggning");
          }
        } else {
          console.error("Fel vid inloggning");
        }
      } catch (error) {
        console.error("Inloggningsfel:", error);
      }
    };

    return (
      <div className="ticket-container">
        <h1>Välkommen till Trafikverkets-Api</h1>
        <h3>Logga in</h3>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setUseremail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="logInBtn" onClick={handleLogin}>LOGGA IN</button>
      </div>
    );
  }
  
  export default Login;
  