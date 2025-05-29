const mongoose = require("mongoose");

/**
 * Schéma mongoose pour un Catway (appontement)
 * @typedef {Object} Catway
 * @property {number} catwayNumber - Numéro unique du catway (appontement)
 * @property {"long"|"short"} catwayType - Type du catway, peut être 'long' ou 'short'
 * @property {string} catwayState - État actuel du catway (exemple : libre, occupé, en maintenance)
 * @property {Date} createdAt - Date de création (automatique)
 * @property {Date} updatedAt - Date de la dernière mise à jour (automatique)
 */
const catwaySchema = new mongoose.Schema(
  {
    catwayNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    catwayType: {
      type: String,
      required: true,
      enum: ["long", "short"],
    },
    catwayState: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Ajoute createdAt et updatedAt automatiquement
  }
);

module.exports = mongoose.model("Catway", catwaySchema);
