import React, { useState } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

function Registration() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister() {
    if (!username || !password) {
      setErrorMessage("Inserisci un username e una password validi.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const json = await response.json();
      if (response.ok) {
        navigate("/login");
        setUsername("");
        setPassword("");
        setErrorMessage("");
      } else {
        setErrorMessage(json.msg);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  return (
    <div className="register-container">
      <h2 className="register-title">REGISTRAZIONE</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <input
        type="text"
        placeholder="Username"
        className="register-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="register-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="register-button" onClick={handleRegister}>
        Registrati
      </button>
    </div>
  );
}

export default Registration;
