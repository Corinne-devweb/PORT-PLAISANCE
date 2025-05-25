import React, { useState, useEffect } from "react";
import { getAllCatways } from "../services/catways";

const Reservation = ({ reservation, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    catwayNumber: reservation?.catwayNumber || "",
    clientName: reservation?.clientName || "",
    boatName: reservation?.boatName || "",
    startDate: reservation?.startDate || "",
    endDate: reservation?.endDate || "",
  });
  const [catways, setCatways] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCatways();
  }, []);

  const loadCatways = async () => {
    try {
      const data = await getAllCatways();
      setCatways(data);
    } catch (error) {
      console.error("Erreur lors du chargement des catways:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.catwayNumber) {
      newErrors.catwayNumber = "Le catway est requis";
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Le nom du client est requis";
    }

    if (!formData.boatName.trim()) {
      newErrors.boatName = "Le nom du bateau est requis";
    }

    if (!formData.startDate) {
      newErrors.startDate = "La date de début est requise";
    }

    if (!formData.endDate) {
      newErrors.endDate = "La date de fin est requise";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start >= end) {
        newErrors.endDate =
          "La date de fin doit être postérieure à la date de début";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const dataToSend = {
        ...formData,
        catwayNumber: Number(formData.catwayNumber),
      };
      onSave(dataToSend);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (reservation) {
      setFormData({
        ...reservation,
        startDate: formatDateForInput(reservation.startDate),
        endDate: formatDateForInput(reservation.endDate),
      });
    }
  }, [reservation]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="form-container">
      <h3>
        {reservation ? "Modifier la réservation" : "Nouvelle réservation"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="catwayNumber">Catway *</label>
          <select
            id="catwayNumber"
            name="catwayNumber"
            value={formData.catwayNumber}
            onChange={handleChange}
            className={errors.catwayNumber ? "error" : ""}
          >
            <option value="">Sélectionnez un catway</option>
            {catways.map((catway) => (
              <option key={catway.catwayNumber} value={catway.catwayNumber}>
                Catway {catway.catwayNumber} ({catway.catwayType})
              </option>
            ))}
          </select>
          {errors.catwayNumber && (
            <span className="error-text">{errors.catwayNumber}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="clientName">Nom du client *</label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={errors.clientName ? "error" : ""}
          />
          {errors.clientName && (
            <span className="error-text">{errors.clientName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="boatName">Nom du bateau *</label>
          <input
            type="text"
            id="boatName"
            name="boatName"
            value={formData.boatName}
            onChange={handleChange}
            className={errors.boatName ? "error" : ""}
          />
          {errors.boatName && (
            <span className="error-text">{errors.boatName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Date de début *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? "error" : ""}
          />
          {errors.startDate && (
            <span className="error-text">{errors.startDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">Date de fin *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={errors.endDate ? "error" : ""}
          />
          {errors.endDate && (
            <span className="error-text">{errors.endDate}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success">
            {reservation ? "Modifier" : "Créer"}
          </button>
          <button type="button" onClick={onCancel} className="btn">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default Reservation;
