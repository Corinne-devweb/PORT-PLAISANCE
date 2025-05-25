import React, { useState, useEffect } from "react";
import {
  getAllReservations,
  createReservation,
  updateReservation,
  deleteReservation,
} from "../services/reservations";
import Reservation from "../components/Reservation";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await getAllReservations();
      setReservations(data);
      setError("");
    } catch (error) {
      setError("Erreur lors du chargement des réservations");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingReservation(null);
    setShowForm(true);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setShowForm(true);
  };

  const handleSave = async (reservationData) => {
    try {
      setError("");
      setSuccess("");

      if (editingReservation) {
        await updateReservation(
          editingReservation.catwayNumber,
          editingReservation._id,
          reservationData
        );
        setSuccess("Réservation modifiée avec succès");
      } else {
        await createReservation(reservationData.catwayNumber, reservationData);
        setSuccess("Réservation créée avec succès");
      }

      setShowForm(false);
      setEditingReservation(null);
      await loadReservations();
    } catch (error) {
      setError(error.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (reservation) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")
    ) {
      try {
        setError("");
        await deleteReservation(reservation.catwayNumber, reservation._id);
        setSuccess("Réservation supprimée avec succès");
        await loadReservations();
      } catch (error) {
        setError(error.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReservation(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  const getReservationStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < today) {
      return { status: "Terminée", className: "status-ended" };
    } else if (start <= today && end >= today) {
      return { status: "En cours", className: "status-current" };
    } else {
      return { status: "À venir", className: "status-upcoming" };
    }
  };

  if (loading) {
    return <div className="loading">Chargement des réservations...</div>;
  }

  return (
    <div className="container">
      <h1>Gestion des Réservations</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm ? (
        <Reservation
          reservation={editingReservation}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Réservations</h2>
            <button onClick={handleCreate} className="btn btn-success">
              Nouvelle Réservation
            </button>
          </div>

          {reservations.length === 0 ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#666" }}
            >
              Aucune réservation trouvée
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
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => {
                  const { status, className } = getReservationStatus(
                    reservation.startDate,
                    reservation.endDate
                  );

                  return (
                    <tr key={reservation._id}>
                      <td>Catway {reservation.catwayNumber}</td>
                      <td>{reservation.clientName}</td>
                      <td>{reservation.boatName}</td>
                      <td>{formatDate(reservation.startDate)}</td>
                      <td>{formatDate(reservation.endDate)}</td>
                      <td>
                        <span className={`badge ${className}`}>{status}</span>
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            onClick={() => handleEdit(reservation)}
                            className="btn btn-warning btn-small"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(reservation)}
                            className="btn btn-danger btn-small"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Reservations;
