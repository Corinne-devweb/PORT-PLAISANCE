import React, { useState, useEffect } from "react";
import { getAllCatways } from "../services/catways";
import { getAllReservations } from "../services/reservations";
import { getAllUsers } from "../services/users";

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalCatways: 0,
    totalReservations: 0,
    totalUsers: 0,
    currentReservations: 0,
  });
  const [currentReservations, setCurrentReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [catways, reservations, users] = await Promise.all([
        getAllCatways(),
        getAllReservations(),
        getAllUsers(),
      ]);

      // Calculer les réservations en cours
      const today = new Date();
      const current = reservations.filter((reservation) => {
        const startDate = new Date(reservation.startDate);
        const endDate = new Date(reservation.endDate);
        return startDate <= today && endDate >= today;
      });

      setStats({
        totalCatways: catways.length,
        totalReservations: reservations.length,
        totalUsers: users.length,
        currentReservations: current.length,
      });

      setCurrentReservations(current);
    } catch (error) {
      setError("Erreur lors du chargement des données");
      console.error("Erreur dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <div>
            <p>
              <strong>Utilisateur:</strong> {user.username} ({user.email})
            </p>
          </div>
          <div>
            <p>
              <strong>Date:</strong> {getCurrentDate()}
            </p>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Catways</h3>
          <div className="number">{stats.totalCatways}</div>
          <p>Total des appontements</p>
        </div>

        <div className="stat-card">
          <h3>Réservations</h3>
          <div className="number">{stats.totalReservations}</div>
          <p>Total des réservations</p>
        </div>

        <div className="stat-card">
          <h3>En cours</h3>
          <div className="number">{stats.currentReservations}</div>
          <p>Réservations actuelles</p>
        </div>

        <div className="stat-card">
          <h3>Utilisateurs</h3>
          <div className="number">{stats.totalUsers}</div>
          <p>Total des utilisateurs</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Réservations en cours</h2>
        </div>
        {currentReservations.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
            Aucune réservation en cours
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Catway</th>
                <th>Client</th>
                <th>Bateau</th>
                <th>Date début</th>
                <th>Date fin</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation, index) => (
                <tr key={index}>
                  <td>Catway {reservation.catwayNumber}</td>
                  <td>{reservation.clientName}</td>
                  <td>{reservation.boatName}</td>
                  <td>{formatDate(reservation.startDate)}</td>
                  <td>{formatDate(reservation.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
