import React, { useState } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function login() {
    const res = await fetch("http://localhost:3001/sessions", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    console.log("Risposta del server al login:", json);
    if (res.status === 401) {
      setErrorMessage(json.msg);
    } else {
      setIsLoggedIn(true);
      navigate("/");
      document.cookie = "isLoggedIn=true; path=/";
    }
  }
  return (
    <div className="login-container">
      <h2 className="login-title">LOGIN</h2>
      <span className="error">{errorMessage}</span>
      <input
        type="text"
        placeholder="Username"
        className="login-input"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" onClick={login}>
        Login
      </button>
    </div>
  );
}

export default Login;
