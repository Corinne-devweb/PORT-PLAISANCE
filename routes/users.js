const express = require("express");
const router = express.Router();

// Import du middleware d'authentification
const authMiddleware = require("../middleware/auth"); // Utilisation du fichier auth.js

// Import des fonctions du service
const service = require("../services/users");

// La route pour lister tous les utilisateurs - protégée par l'authentification
router.get("/", authMiddleware, service.getAll);

// La route pour récupérer les infos d'un utilisateur spécifique - protégée par l'authentification
router.get("/:email", authMiddleware, service.getByEmail);

// La route pour ajouter un utilisateur - route non protégée
router.post("/", service.add);

// La route pour modifier un utilisateur - protégée par l'authentification
router.put("/:email", authMiddleware, service.update);

// La route pour supprimer un utilisateur - protégée par l'authentification
router.delete("/:email", authMiddleware, service.delete);

module.exports = router;
