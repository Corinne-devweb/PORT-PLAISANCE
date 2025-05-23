const express = require("express");
const router = express.Router();

// Import des services
const catwayService = require("../services/catways");

// Middlewares
const authMiddleware = require("../middleware/auth");
const checkCatwayExists = require("../middleware/checkCatwayExists");

// GET /api/catways - Liste tous les catways
router.get("/", authMiddleware, catwayService.getAll);

// GET /api/catways/:catwayId - Détails d'un catway spécifique
router.get(
  "/:catwayId",
  authMiddleware,
  checkCatwayExists,
  catwayService.getById
);

// POST /api/catways - Ajouter un nouveau catway
router.post("/", authMiddleware, catwayService.create);

// PUT /api/catways/:catwayId - Modifier un catway existant
router.put(
  "/:catwayId",
  authMiddleware,
  checkCatwayExists,
  catwayService.update
);

// DELETE /api/catways/:catwayId - Supprimer un catway
router.delete(
  "/:catwayId",
  authMiddleware,
  checkCatwayExists,
  catwayService.delete
);

module.exports = router;
