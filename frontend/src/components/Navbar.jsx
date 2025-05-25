import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../services/auth";

const Navbar = ({ user, onLogout }) => {
  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  return (
    <nav className="navbar">
      <h1>Port de plaisance de Russell</h1>
      <div className="navbar-menu">
        <Link to="/dashboard">Tableau de bord</Link>
        <Link to="/catways">Catways</Link>
        <Link to="/reservations">Réservations</Link>
        <Link to="/users">Utilisateurs</Link>
        <a href="/api-docs" target="_blank" rel="noopener noreferrer">
          Documentation API
        </a>
      </div>
      <div className="navbar-user">
        <span>Bienvenue, {user?.username || "utilisateur"}</span>
        <button onClick={handleLogout} className="logout-btn">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
