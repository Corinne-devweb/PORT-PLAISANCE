const express = require("express");
const router = express.Router();
const reservationService = require("../services/reservations");
const authMiddleware = require("../middleware/auth");
const checkCatwayExists = require("../middleware/checkCatwayExists");

// 1. Routes principales (standard REST)
router.get("/", authMiddleware, reservationService.getAll);
router.post("/", authMiddleware, reservationService.create);

// 2. Routes par ID de réservation
router.get("/:reservationId", authMiddleware, reservationService.getById);
router.put("/:reservationId", authMiddleware, reservationService.update);
router.delete("/:reservationId", authMiddleware, reservationService.delete);

// 3. Routes spécifiques aux catways (optionnel)
router.get(
  "/catway/:catwayId",
  authMiddleware,
  checkCatwayExists,
  reservationService.getByCatway
);

module.exports = router;
