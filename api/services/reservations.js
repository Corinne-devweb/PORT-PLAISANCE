const Reservation = require("../models/reservation");
const Catway = require("../models/catway");

module.exports = {
  /**
   * Récupérer toutes les réservations.
   * @returns {Promise<Array>} Liste des réservations
   * @throws {Error} En cas d'erreur serveur
   */
  getAll: async () => {
    try {
      const reservations = await Reservation.find();
      return reservations;
    } catch (error) {
      throw new Error("Erreur serveur: " + error.message);
    }
  },

  /**
   * Créer une nouvelle réservation.
   * @param {Object} data - Données de la réservation
   * @param {number|string} data.catwayNumber - Numéro du catway réservé
   * @param {string} data.clientName - Nom du client
   * @param {string} data.boatName - Nom du bateau
   * @param {Date|string} data.startDate - Date de début
   * @param {Date|string} data.endDate - Date de fin
   * @returns {Promise<Object>} La réservation créée
   * @throws {Error} Si un champ est manquant ou si le catway n'existe pas
   */
  create: async (data) => {
    try {
      const { catwayNumber, clientName, boatName, startDate, endDate } = data;

      if (!catwayNumber || !clientName || !boatName || !startDate || !endDate) {
        throw new Error("Tous les champs sont requis");
      }

      // Vérifie que le catway existe
      const catwayExists = await Catway.findOne({
        catwayNumber: Number(catwayNumber),
      });
      if (!catwayExists) {
        throw new Error("Catway non trouvé");
      }

      const newReservation = new Reservation({
        catwayNumber: Number(catwayNumber),
        clientName,
        boatName,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });

      await newReservation.save();
      return newReservation;
    } catch (error) {
      throw new Error("Erreur création réservation: " + error.message);
    }
  },

  /**
   * Récupérer une réservation par son ID.
   * @param {string} reservationId - ID de la réservation
   * @returns {Promise<Object>} La réservation trouvée
   * @throws {Error} Si la réservation n'est pas trouvée ou erreur serveur
   */
  getById: async (reservationId) => {
    try {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        throw new Error("Réservation non trouvée");
      }
      return reservation;
    } catch (error) {
      throw new Error("Erreur serveur: " + error.message);
    }
  },

  /**
   * Mettre à jour une réservation.
   * @param {string} reservationId - ID de la réservation à modifier
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} La réservation mise à jour
   * @throws {Error} Si la réservation ou le catway n'existent pas ou erreur serveur
   */
  update: async (reservationId, updateData) => {
    try {
      if (updateData.catwayNumber) {
        const catwayExists = await Catway.findOne({
          catwayNumber: Number(updateData.catwayNumber),
        });
        if (!catwayExists) {
          throw new Error("Catway non trouvé");
        }
        updateData.catwayNumber = Number(updateData.catwayNumber);
      }

      const updatedReservation = await Reservation.findByIdAndUpdate(
        reservationId,
        updateData,
        { new: true }
      );

      if (!updatedReservation) {
        throw new Error("Réservation non trouvée");
      }

      return updatedReservation;
    } catch (error) {
      throw new Error("Échec de la mise à jour: " + error.message);
    }
  },

  /**
   * Supprimer une réservation par son ID.
   * @param {string} reservationId - ID de la réservation à supprimer
   * @returns {Promise<Object>} Message de confirmation
   * @throws {Error} Si la réservation n'est pas trouvée ou erreur serveur
   */
  delete: async (reservationId) => {
    try {
      const deleted = await Reservation.findByIdAndDelete(reservationId);
      if (!deleted) {
        throw new Error("Réservation non trouvée");
      }
      return { message: "Réservation supprimée" };
    } catch (error) {
      throw new Error("Échec de la suppression: " + error.message);
    }
  },

  /**
   * Récupérer les réservations par numéro de catway.
   * @param {number|string} catwayId - Numéro du catway
   * @returns {Promise<Array>} Liste des réservations pour ce catway
   * @throws {Error} En cas d'erreur serveur
   */
  getByCatway: async (catwayId) => {
    try {
      const reservations = await Reservation.find({
        catwayNumber: Number(catwayId),
      });
      return reservations;
    } catch (error) {
      throw new Error("Erreur serveur: " + error.message);
    }
  },
};
