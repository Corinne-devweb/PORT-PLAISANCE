const express = require("express");
const router = express.Router();

// Import des services
const catwayService = require("../services/catways");

// Middlewares
const authMiddleware = require("../middleware/auth");
const checkCatwayExists = require("../middleware/checkCatwayExists");

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways
 */

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Récupérer la liste de tous les catways
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways
 */
router.get("/", authMiddleware, catwayService.getAll);

/**
 * @swagger
 * /api/catways/{catwayId}:
 *   get:
 *     summary: Obtenir un catway par son ID
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du catway
 *     responses:
 *       200:
 *         description: Détails du catway
 *       404:
 *         description: Catway non trouvé
 */
router.get(
  "/:catwayId",
  authMiddleware,
  checkCatwayExists,
  catwayService.getById
);

/**
 * @swagger
 * /api/catways:
 *   post:
 *     summary: Créer un nouveau catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayNumber
 *               - catwayType
 *               - catwayState
 *             properties:
 *               catwayNumber:
 *                 type: string
 *               catwayType:
 *                 type: string
 *                 enum: [short, long]
 *               catwayState:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catway créé
 */
router.post("/", authMiddleware, catwayService.create);

/**
 * @swagger
 * /api/catways/{catwayId}:
 *   put:
 *     summary: Modifier l'état d'un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du catway
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayState:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catway mis à jour
 *       404:
 *         description: Catway non trouvé
 */
router.put(
  "/:catwayId",
  authMiddleware,
  checkCatwayExists,
  catwayService.update
);

/**
 * @swagger
 * /api/catways/{catwayId}:
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du catway
 *     responses:
 *       204:
 *         description: Catway supprimé
 *       404:
 *         description: Catway non trouvé
 */
router.delete(
  "/:catwayId",
  authMiddleware,
  checkCatwayExists,
  catwayService.delete
);

module.exports = router;
