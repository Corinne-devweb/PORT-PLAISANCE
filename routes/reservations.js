const express = require("express");
const router = express.Router();

// Import des fonctions du service
const service = require("../services/reservations");

// Import du middleware pour vérifier l'existence du catway
const checkCatwayExists = require("../middleware/checkCatwayExists");

// Import du middleware d'authentification
const authMiddleware = require("../middleware/auth"); // Utilisation du fichier auth.js

// La route pour lister toutes les réservations d'un catway - protégée par l'authentification
router.get(
  "/:id/reservations",
  authMiddleware,
  checkCatwayExists,
  service.getAll
);

// La route pour récupérer les détails d'une réservation spécifique - protégée par l'authentification
router.get(
  "/:id/reservations/:reservationId",
  authMiddleware,
  checkCatwayExists,
  service.getById
);

// La route pour ajouter une nouvelle réservation - protégée par l'authentification
router.post(
  "/:id/reservations",
  authMiddleware,
  checkCatwayExists,
  service.add
);

// La route pour modifier une réservation existante - protégée par l'authentification
router.put(
  "/:id/reservations/:reservationId",
  authMiddleware,
  checkCatwayExists,
  service.update
);

// La route pour supprimer une réservation - protégée par l'authentification
router.delete(
  "/:id/reservations/:reservationId",
  authMiddleware,
  checkCatwayExists,
  service.delete
);

module.exports = router;
