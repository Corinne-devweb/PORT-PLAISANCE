const mongoose = require("mongoose");

/**
 * Schéma mongoose pour une Réservation de catway
 * @typedef {Object} Reservation
 * @property {number} catwayNumber - Numéro du catway réservé (référence au modèle Catway)
 * @property {string} clientName - Nom du client ayant fait la réservation
 * @property {string} boatName - Nom du bateau amarré
 * @property {Date} startDate - Date de début de la réservation
 * @property {Date} endDate - Date de fin de la réservation (doit être postérieure à startDate)
 * @property {Date} createdAt - Date de création automatique
 * @property {Date} updatedAt - Date de mise à jour automatique
 */
const reservationSchema = new mongoose.Schema(
  {
    // Référence modèle Catway
    catwayNumber: {
      type: Number,
      required: true,
      ref: "Catway",
    },

    // Le nom du client ayant effectué la réservation
    clientName: {
      type: String,
      required: true,
    },

    // Le nom du bateau amarré
    boatName: {
      type: String,
      required: true,
    },

    // La date de début de la réservation
    startDate: {
      type: Date,
      required: true,
    },

    // La date de fin de la réservation
    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "La date de fin doit être postérieure à la date de début",
      },
    },
  },
  {
    timestamps: true, // createdAt et updatedAt générés automatiquement
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);
