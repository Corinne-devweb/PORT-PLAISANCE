// routes/catways.js

const express = require("express");
const router = express.Router();

// Import des fonctions du service
const service = require("../services/catways");

// La route pour lister tous les catways
router.get("/", service.getAll);

// La route pour récupérer les détails d'un catway spécifique
router.get("/:id", service.getById);

// La route pour ajouter un nouveau catway
router.post("/", service.add);

// La route pour modifier un catway existant
router.put("/:id", service.update);

// La route pour supprimer un catway
router.delete("/:id", service.delete);

module.exports = router;
