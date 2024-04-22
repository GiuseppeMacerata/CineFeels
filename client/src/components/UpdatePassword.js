import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdatePassword() {
  const navigate = useNavigate();

  const [newPassword, setnewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  async function updatePassword() {
    try {
      const res = await fetch("http://localhost:3001/change-password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.status !== 200) {
        const json = await res.json();
        setErrorMessage(json.msg);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento della password:", error);
      setErrorMessage(
        "Si è verificato un errore durante l'aggiornamento della password"
      );
    }
  }

  return (
    <div className="update-user-container">
      <h2 className="update-user-title">Aggiorna Password</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <input
        type="text"
        placeholder="Password attuale"
        className="update-user-input"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nuova Password"
        className="update-user-input"
        value={newPassword}
        onChange={(e) => setnewPassword(e.target.value)}
      />
      <button className="update-user-button" onClick={updatePassword}>
        Aggiorna
      </button>
    </div>
  );
}

export default UpdatePassword;
