// models/catway.js

const mongoose = require("mongoose");

// Définition du schéma de Catway
const catwaySchema = new mongoose.Schema({
  // Le numéro de catway, doit être unique
  catwayNumber: {
    type: String,
    required: true,
    unique: true,
  },
  // Le type de catway : 'long' ou 'short'
  catwayType: {
    type: String,
    required: true,
    enum: ["long", "short"], // On restreint les valeurs possibles
  },
  // L'état du catway (par exemple, "bon état", "mauvais état", etc.)
  catwayState: {
    type: String,
    required: true,
  },
});

// Création du modèle Catway avec le schéma défini
const Catway = mongoose.model("Catway", catwaySchema);

module.exports = Catway;
