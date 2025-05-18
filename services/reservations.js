// services/reservations.js

const Reservation = require("../models/reservation");
const Catway = require("../models/catway");

// Fonction pour lister toutes les réservations d'un catway
exports.getAll = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }

    const reservations = await Reservation.find({
      catwayNumber: req.params.id,
    });
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération des réservations");
  }
};

// Fonction pour récupérer les détails d'une réservation spécifique
exports.getById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      catwayNumber: req.params.id,
      _id: req.params.reservationId,
    });

    if (!reservation) {
      return res.status(404).send("Réservation non trouvée");
    }

    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération de la réservation");
  }
};

// Fonction pour ajouter une nouvelle réservation
exports.add = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }

    const { clientName, boatName, startDate, endDate } = req.body;

    if (!clientName || !boatName || !startDate || !endDate) {
      return res.status(400).send("Tous les champs sont requis");
    }

    const newReservation = new Reservation({
      catwayNumber: req.params.id,
      clientName,
      boatName,
      startDate,
      endDate,
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(500).send("Erreur lors de la création de la réservation");
  }
};

// Fonction pour modifier une réservation existante
exports.update = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }

    const reservation = await Reservation.findOne({
      catwayNumber: req.params.id,
      _id: req.params.reservationId,
    });

    if (!reservation) {
      return res.status(404).send("Réservation non trouvée");
    }

    const { clientName, boatName, startDate, endDate } = req.body;

    reservation.clientName = clientName || reservation.clientName;
    reservation.boatName = boatName || reservation.boatName;
    reservation.startDate = startDate || reservation.startDate;
    reservation.endDate = endDate || reservation.endDate;

    await reservation.save();
    res.status(200).json(reservation);
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour de la réservation");
  }
};

// Fonction pour supprimer une réservation
exports.delete = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }

    const reservation = await Reservation.findOne({
      catwayNumber: req.params.id,
      _id: req.params.reservationId,
    });

    if (!reservation) {
      return res.status(404).send("Réservation non trouvée");
    }

    await reservation.remove();
    res.status(200).send("Réservation supprimée avec succès");
  } catch (err) {
    res.status(500).send("Erreur lors de la suppression de la réservation");
  }
};
