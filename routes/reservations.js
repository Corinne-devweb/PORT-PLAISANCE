const express = require("express");
const router = express.Router();
const reservationService = require("../services/reservations");
const authMiddleware = require("../middleware/auth");
const checkCatwayExists = require("../middleware/checkCatwayExists");

// GET /api/reservations - Récupérer toutes les réservations
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reservations = await reservationService.getAll();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/reservations - Créer une réservation
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newReservation = await reservationService.create(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/reservations/:reservationId - Récupérer réservation par ID
router.get("/:reservationId", authMiddleware, async (req, res) => {
  try {
    const reservation = await reservationService.getById(
      req.params.reservationId
    );
    res.json(reservation);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// PUT /api/reservations/:reservationId - Mettre à jour réservation
router.put("/:reservationId", authMiddleware, async (req, res) => {
  try {
    const updated = await reservationService.update(
      req.params.reservationId,
      req.body
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/reservations/:reservationId - Supprimer réservation
router.delete("/:reservationId", authMiddleware, async (req, res) => {
  try {
    const result = await reservationService.delete(req.params.reservationId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// GET /api/reservations/catway/:catwayId - Réservations par catway
router.get(
  "/catway/:catwayId",
  authMiddleware,
  checkCatwayExists,
  async (req, res) => {
    try {
      const reservations = await reservationService.getByCatway(
        req.params.catwayId
      );
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
