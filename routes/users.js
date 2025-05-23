const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const service = require("../services/users");

// 1. Route pour créer un utilisateur (inscription) - pas besoin d'être connecté
router.post("/", async (req, res) => {
  try {
    await service.add(req, res);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// 2. Route pour se connecter (login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur non trouvé" });
    }

    // Utilise la méthode du modèle
    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = user.generateAuthToken();

    res.json({ token });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

// 3. Route pour voir tous les utilisateurs — nécessite d'être connecté
router.get("/", authMiddleware, service.getAll);

// 4. Route pour voir un utilisateur par email — nécessite d'être connecté
router.get("/:email", authMiddleware, service.getByEmail);

// 5. Routes update et delete — nécessite d'être connecté
router.put("/:email", authMiddleware, service.update);
router.delete("/:email", authMiddleware, service.delete);

module.exports = router;
