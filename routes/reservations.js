const express = require("express");
const router = express.Router();
const reservationService = require("../services/reservations");
const authMiddleware = require("../middleware/auth");
const checkCatwayExists = require("../middleware/checkCatwayExists");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations de catways
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reservations = await reservationService.getAll();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Créer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: string
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Réservation créée
 *       400:
 *         description: Erreur de validation
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newReservation = await reservationService.create(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reservations/{reservationId}:
 *   get:
 *     summary: Obtenir une réservation par ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la réservation
 *     responses:
 *       200:
 *         description: Détails de la réservation
 *       404:
 *         description: Réservation non trouvée
 */
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

/**
 * @swagger
 * /api/reservations/{reservationId}:
 *   put:
 *     summary: Mettre à jour une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Réservation mise à jour
 *       400:
 *         description: Données invalides
 */
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

/**
 * @swagger
 * /api/reservations/{reservationId}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Réservation supprimée
 *       404:
 *         description: Réservation non trouvée
 */
router.delete("/:reservationId", authMiddleware, async (req, res) => {
  try {
    const result = await reservationService.delete(req.params.reservationId);
    res.json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/reservations/catway/{catwayId}:
 *   get:
 *     summary: Obtenir les réservations d’un catway spécifique
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: catwayId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du catway
 *     responses:
 *       200:
 *         description: Liste des réservations liées au catway
 *       500:
 *         description: Erreur interne
 */
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
