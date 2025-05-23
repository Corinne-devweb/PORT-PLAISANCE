const Reservation = require("../models/reservation");
const Catway = require("../models/catway");

module.exports = {
  // [GET] /api/reservations
  getAll: async (req, res) => {
    try {
      const reservations = await Reservation.find(); // Sans populate car on référence catwayNumber (Number)
      res.json(reservations);
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur",
        details: error.message,
      });
    }
  },

  // [POST] /api/reservations
  create: async (req, res) => {
    try {
      const { catwayNumber, startDate, endDate } = req.body;

      // Validation basique
      if (!catwayNumber || !startDate || !endDate) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
      }

      // Vérifier que le catway existe
      const catwayExists = await Catway.findOne({ catwayNumber });
      if (!catwayExists) {
        return res.status(400).json({ message: "Catway non trouvé" });
      }

      // Créer la réservation
      const newReservation = new Reservation(req.body);
      await newReservation.save();
      res.status(201).json(newReservation);
    } catch (error) {
      res.status(400).json({
        message: "Données invalides",
        details: error.message,
      });
    }
  },

  // [GET] /api/reservations/:reservationId
  getById: async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.reservationId);
      if (!reservation) return res.status(404).json({ message: "Non trouvé" });
      res.json(reservation);
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur",
        details: error.message,
      });
    }
  },

  // [PUT] /api/reservations/:reservationId
  update: async (req, res) => {
    try {
      // Si catwayNumber est modifié, vérifier qu'il existe
      if (req.body.catwayNumber) {
        const catwayExists = await Catway.findOne({
          catwayNumber: req.body.catwayNumber,
        });
        if (!catwayExists) {
          return res.status(400).json({ message: "Catway non trouvé" });
        }
      }

      const updatedReservation = await Reservation.findByIdAndUpdate(
        req.params.reservationId,
        req.body,
        { new: true }
      );

      if (!updatedReservation) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }

      res.json(updatedReservation);
    } catch (error) {
      res.status(400).json({
        message: "Échec de la mise à jour",
        details: error.message,
      });
    }
  },

  // [DELETE] /api/reservations/:reservationId
  delete: async (req, res) => {
    try {
      const deleted = await Reservation.findByIdAndDelete(
        req.params.reservationId
      );
      if (!deleted) {
        return res.status(404).json({ message: "Réservation non trouvée" });
      }
      res.json({ message: "Réservation supprimée" });
    } catch (error) {
      res.status(500).json({
        message: "Échec de la suppression",
        details: error.message,
      });
    }
  },

  // [GET] /api/reservations/catway/:catwayId
  getByCatway: async (req, res) => {
    try {
      const reservations = await Reservation.find({
        catwayNumber: req.params.catwayId,
      });
      res.json(reservations);
    } catch (error) {
      res.status(500).json({
        message: "Erreur serveur",
        details: error.message,
      });
    }
  },
};
