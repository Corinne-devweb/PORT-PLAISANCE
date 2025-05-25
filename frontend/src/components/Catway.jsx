import React, { useState } from "react";

const Catway = ({ catway, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    catwayNumber: String(catway?.catwayNumber || ""),
    catwayType: catway?.catwayType || "long",
    catwayState: catway?.catwayState || "",
  });
  const [errors, setErrors] = useState({});

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

    if (!formData.catwayNumber.trim()) {
      newErrors.catwayNumber = "Le numéro de catway est requis";
    }

    if (!formData.catwayState.trim()) {
      newErrors.catwayState = "L'état du catway est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="form-container">
      <h3>{catway ? "Modifier le catway" : "Nouveau catway"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="catwayNumber">Numéro de catway *</label>
          <input
            type="text"
            id="catwayNumber"
            name="catwayNumber"
            value={formData.catwayNumber}
            onChange={handleChange}
            disabled={!!catway}
            className={errors.catwayNumber ? "error" : ""}
          />
          {errors.catwayNumber && (
            <span className="error-text">{errors.catwayNumber}</span>
          )}
          {catway && <small>Le numéro ne peut pas être modifié</small>}
        </div>

        <div className="form-group">
          <label htmlFor="catwayType">Type de catway</label>
          <select
            id="catwayType"
            name="catwayType"
            value={formData.catwayType}
            onChange={handleChange}
            disabled={!!catway}
          >
            <option value="long">Long</option>
            <option value="short">Court</option>
          </select>
          {catway && <small>Le type ne peut pas être modifié</small>}
        </div>

        <div className="form-group">
          <label htmlFor="catwayState">État du catway *</label>
          <textarea
            id="catwayState"
            name="catwayState"
            value={formData.catwayState}
            onChange={handleChange}
            placeholder="Décrivez l'état actuel du catway..."
            className={errors.catwayState ? "error" : ""}
          />
          {errors.catwayState && (
            <span className="error-text">{errors.catwayState}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success">
            {catway ? "Modifier" : "Créer"}
          </button>
          <button type="button" onClick={onCancel} className="btn">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default Catway;
