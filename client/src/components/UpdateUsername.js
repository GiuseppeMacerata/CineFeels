import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UpdateUsername() {
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function updateUsername() {
    try {
      const res = await fetch("http://localhost:3001/change-username", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername }),
      });

      if (res.status !== 200) {
        const json = await res.json();
        setErrorMessage(json.msg);
      } else {
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Errore durante l'aggiornamento del nome utente:", error);
      setErrorMessage(
        "Si è verificato un errore durante l'aggiornamento del nome utente"
      );
    }
  }

  return (
    <div className="update-user-container">
      <h2 className="update-user-title">Aggiorna Nome Utente</h2>
      {errorMessage && <div className="error">{errorMessage}</div>}
      <input
        type="text"
        placeholder="Nuovo Nome Utente"
        className="update-user-input"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <button className="update-user-button" onClick={updateUsername}>
        Aggiorna
      </button>
    </div>
  );
}

export default UpdateUsername;
