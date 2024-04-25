import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="profile-container">
      <h2 className="profile-title">Cosa vuoi aggiornare?</h2>
      <div className="profile-buttons">
        <Link to="/change-username" className="profile-button">
          Nome utente
        </Link>
        <Link to="/change-password" className="profile-button">
          Password
        </Link>
      </div>
    </div>
  );
}
