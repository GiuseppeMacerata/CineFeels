import React from "react";
import "../index.css"; // Importa il file CSS per lo stile dell'Header
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function Header({ isLoggedIn, setIsLoggedIn }) {
  const { pathname } = useLocation();

  const [username, setUsername] = useState("");

  useEffect(() => {
    checkAuthStatus();
  }, [isLoggedIn]);

  async function checkAuthStatus() {
    const res = await fetch("http://localhost:3001/sessions", {
      method: "GET",
      credentials: "include",
    });
    const json = await res.json();
    console.log(
      "Risposta del server al controllo dello stato di autenticazione:",
      json
    );
    if (res.status === 200) {
      setIsLoggedIn(true);
      setUsername(json.username);
    } else {
      setIsLoggedIn(false);
    }
  }

  async function handleLogout() {
    const res = await fetch("http://localhost:3001/sessions", {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 200) {
      setIsLoggedIn(false);
      setUsername("");
    }
  }

  if (pathname === "/login") {
    return (
      <div className="header-container">
        <Link to="/" className="logo">
          CINEFEELS🍿
        </Link>
        <div className="header-content">
          <Link to="/register" className="header-button">
            Registrati
          </Link>
        </div>
      </div>
    );
  }

  if (pathname === "/register") {
    return (
      <div className="header-container">
        <Link to="/" className="logo">
          CINEFEELS🍿
        </Link>
        <div className="header-content">
          <Link to="/login" className="header-button">
            Login
          </Link>
        </div>
      </div>
    );
  }

  // Restituisce l'header completo in tutte le altre pagine
  return (
    <div className="header-container">
      <Link to="/" className="logo">
        CINEFEELS🍿
      </Link>
      <div className="header-content">
        {isLoggedIn ? (
          <div>
            <Link to="/profile" className="username-link">
              {username}
            </Link>
            <button className="header-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="header-button">
              Login
            </Link>
            <Link to="/register" className="header-button">
              Registrati
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
