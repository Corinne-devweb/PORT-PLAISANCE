// routes/users.js

const express = require("express");
const router = express.Router();

// Import des fonctions du service
const service = require("../services/users");

// La route pour lister tous les utilisateurs
router.get("/", service.getAll);

// La route pour récupérer les infos d'un utilisateur spécifique
router.get("/:email", service.getByEmail);

// La route pour ajouter un utilisateur
router.post("/", service.add);

// La route pour modifier un utilisateur
router.put("/:email", service.update);

// La route pour supprimer un utilisateur
router.delete("/:email", service.delete);

module.exports = router;
