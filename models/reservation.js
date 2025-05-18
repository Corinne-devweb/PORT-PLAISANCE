// models/reservation.js

const mongoose = require("mongoose");

// Définition du schéma de Reservation
const reservationSchema = new mongoose.Schema({
  // Le numéro de catway réservé
  catwayNumber: {
    type: String,
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
  },
});

// Création du modèle Reservation avec le schéma défini
const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation;
