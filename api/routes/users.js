const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Inscrire un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur lors de l'inscription
 */
/**
 * @function
 * @name POST /api/users
 * @description Inscrit un nouvel utilisateur et retourne un token d'authentification
 */
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    const token = user.generateAuthToken();
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      user: userWithoutPassword,
      token,
    });
  } catch (err) {
    console.error("Erreur inscription :", err);
    res.status(400).json({
      message: "Erreur lors de l'inscription",
      error: err.message,
    });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Utilisateur connecté avec succès
 *       400:
 *         description: Email ou mot de passe manquant
 *       401:
 *         description: Utilisateur non trouvé ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
/**
 * @function
 * @name POST /api/users/login
 * @description Authentifie un utilisateur existant avec email et mot de passe
 */
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

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    const token = user.generateAuthToken();
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (sans mot de passe)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       500:
 *         description: Erreur serveur
 */
/**
 * @function
 * @name GET /api/users
 * @description Récupère tous les utilisateurs (sans mot de passe)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Erreur récupération utilisateurs:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Mettre à jour un utilisateur par son ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       400:
 *         description: Données invalides ou ID invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
/**
 * Middleware pour vérifier si l'ID est un ObjectId valide
 */
function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    return res.status(400).json({ message: "ID utilisateur invalide" });
  }
  next();
}

/**
 * @function
 * @name PUT /api/users/:userId
 * @description Met à jour les infos d’un utilisateur par son ID
 */
router.put("/:userId", authMiddleware, validateObjectId, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (err) {
    console.error("Erreur mise à jour utilisateur :", err);
    res.status(400).json({
      message: "Erreur lors de la mise à jour",
      error: err.message,
    });
  }
});

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Supprimer un utilisateur par son ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de l'utilisateur
 *     responses:
 *       204:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
/**
 * @function
 * @name DELETE /api/users/:userId
 * @description Supprime un utilisateur par son ID
 */
router.delete(
  "/:userId",
  authMiddleware,
  validateObjectId,
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(204).send();
    } catch (err) {
      console.error("Erreur suppression utilisateur :", err);
      res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
  }
);

module.exports = router;
