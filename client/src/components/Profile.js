import { Link } from "react-router-dom";

function UpdateOptions() {
  return (
    <div className="update-options-container">
      <h2 className="update-options-title">Cosa vuoi aggiornare?</h2>
      <div className="update-options-buttons">
        <Link to="/change-username" className="update-options-button">
          Nome utente
        </Link>
        <Link to="/change-password" className="update-options-button">
          Password
        </Link>
      </div>
    </div>
  );
}

export default UpdateOptions;
