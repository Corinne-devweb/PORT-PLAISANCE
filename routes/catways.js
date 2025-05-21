const express = require("express");
const router = express.Router();

// Import des fonctions du service
const service = require("../services/catways");

// Import du middleware pour vérifier l'existence du catway
const checkCatwayExists = require("../middleware/checkCatwayExists");

// Import du middleware d'authentification
const authMiddleware = require("../middleware/auth"); // Utilisation du fichier auth.js

// La route pour lister tous les catways - protégée par l'authentification
router.get("/", authMiddleware, service.getAll);

// La route pour récupérer les détails d'un catway spécifique - protégée par l'authentification
router.get("/:id", authMiddleware, checkCatwayExists, service.getById);

// La route pour ajouter un nouveau catway - protégée par l'authentification
router.post("/", authMiddleware, service.add);

// La route pour modifier un catway existant - protégée par l'authentification
router.put("/:id", authMiddleware, checkCatwayExists, service.update);

// La route pour supprimer un catway - protégée par l'authentification
router.delete("/:id", authMiddleware, checkCatwayExists, service.delete);

module.exports = router;
