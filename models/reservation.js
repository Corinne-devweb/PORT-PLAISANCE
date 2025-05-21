const mongoose = require("mongoose");

// Définition du schéma pour les réservations
const reservationSchema = new mongoose.Schema(
  {
    // Référence au modèle Catway
    catwayNumber: {
      type: Number,
      required: true,
      ref: "Catway", // Référence au modèle Catway
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
          // La date de fin doit être après la date de début
          return value > this.startDate;
        },
        message: "La date de fin doit être postérieure à la date de début",
      },
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

// Création du modèle Reservation
module.exports = mongoose.model("Reservation", reservationSchema);
