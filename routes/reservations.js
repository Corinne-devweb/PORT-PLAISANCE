// routes/reservations.js

const express = require("express");
const router = express.Router();

// Import des fonctions du service
const service = require("../services/reservations");

// La route pour lister toutes les réservations d'un catway
router.get("/:id/reservations", service.getAll);

// La route pour récupérer les détails d'une réservation spécifique
router.get("/:id/reservations/:reservationId", service.getById);

// La route pour ajouter une nouvelle réservation
router.post("/:id/reservations", service.add);

// La route pour modifier une réservation existante
router.put("/:id/reservations/:reservationId", service.update);

// La route pour supprimer une réservation
router.delete("/:id/reservations/:reservationId", service.delete);

module.exports = router;
