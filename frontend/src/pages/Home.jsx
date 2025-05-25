import React, { useState } from "react";
import { login } from "../services/auth";

const Home = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Supprimer l'erreur quand l'utilisateur tape
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await login(formData.email, formData.password);
      onLogin(userData);
    } catch (error) {
      setError(error.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <div className="home-header">
        <h1>Port de Plaisance de Russell</h1>
        <p>
          Bienvenue dans l'application de gestion des réservations de catways.
          Cette application permet à la capitainerie de gérer efficacement les
          appontements et les réservations des bateaux de plaisance.
        </p>
      </div>

      <div className="form-container">
        <h2>Connexion</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <a
            href="/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Documentation de l'API
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
