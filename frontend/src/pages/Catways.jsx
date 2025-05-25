import React, { useState, useEffect } from "react";
import {
  getAllCatways,
  createCatway,
  updateCatway,
  deleteCatway,
} from "../services/catways";
import Catway from "../components/Catway";

const Catways = () => {
  const [catways, setCatways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCatway, setEditingCatway] = useState(null);

  useEffect(() => {
    loadCatways();
  }, []);

  const loadCatways = async () => {
    try {
      setLoading(true);
      const data = await getAllCatways();
      setCatways(data);
      setError("");
    } catch (error) {
      setError("Erreur lors du chargement des catways");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCatway(null);
    setShowForm(true);
  };

  const handleEdit = (catway) => {
    setEditingCatway(catway);
    setShowForm(true);
  };

  const handleSave = async (catwayData) => {
    try {
      setError("");
      setSuccess("");

      if (editingCatway) {
        await updateCatway(editingCatway.catwayNumber, catwayData);
        setSuccess("Catway modifié avec succès");
      } else {
        await createCatway(catwayData);
        setSuccess("Catway créé avec succès");
      }

      setShowForm(false);
      setEditingCatway(null);
      await loadCatways();
    } catch (error) {
      setError(error.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (catwayNumber) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce catway ?")) {
      try {
        setError("");
        await deleteCatway(catwayNumber);
        setSuccess("Catway supprimé avec succès");
        await loadCatways();
      } catch (error) {
        setError(error.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCatway(null);
  };

  if (loading) {
    return <div className="loading">Chargement des catways...</div>;
  }

  return (
    <div className="container">
      <h1>Gestion des Catways</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm ? (
        <Catway
          catway={editingCatway}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Liste des Catways</h2>
            <button onClick={handleCreate} className="btn btn-success">
              Nouveau Catway
            </button>
          </div>

          {catways.length === 0 ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#666" }}
            >
              Aucun catway trouvé
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Type</th>
                  <th>État</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {catways.map((catway) => (
                  <tr key={catway.catwayNumber}>
                    <td>{catway.catwayNumber}</td>
                    <td>
                      <span
                        className={`badge ${
                          catway.catwayType === "long"
                            ? "badge-primary"
                            : "badge-secondary"
                        }`}
                      >
                        {catway.catwayType === "long" ? "Long" : "Court"}
                      </span>
                    </td>
                    <td>{catway.catwayState}</td>
                    <td>
                      <div className="actions">
                        <button
                          onClick={() => handleEdit(catway)}
                          className="btn btn-warning btn-small"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(catway.catwayNumber)}
                          className="btn btn-danger btn-small"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Catways;
