const Catway = require("../models/catway");

/**
 * Récupérer tous les catways.
 * @param {import('express').Request} req - Objet requête Express
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>}
 */
exports.getAll = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération des catways",
      error: err.message,
    });
  }
};

/**
 * Récupérer un catway par son numéro.
 * @param {import('express').Request} req - Objet requête Express
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>}
 */
exports.getById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.catwayId });
    if (!catway) {
      return res.status(404).json({ message: "Catway non trouvé" });
    }
    res.status(200).json(catway);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la récupération du catway",
      error: err.message,
    });
  }
};

/**
 * Créer un nouveau catway.
 * @param {import('express').Request} req - Objet requête Express contenant catwayNumber, catwayType, catwayState dans req.body
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>}
 */
exports.create = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    if (!catwayNumber || !catwayType || !catwayState) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const existingCatway = await Catway.findOne({ catwayNumber });
    if (existingCatway) {
      return res.status(400).json({
        message: "Un catway avec ce numéro existe déjà",
      });
    }

    const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
    await newCatway.save();
    res.status(201).json(newCatway);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la création du catway",
      error: err.message,
    });
  }
};

/**
 * Mettre à jour un catway existant par son numéro.
 * @param {import('express').Request} req - Objet requête Express, catwayId en params, catwayType et catwayState dans body
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>}
 */
exports.update = async (req, res) => {
  try {
    const { catwayType, catwayState } = req.body;
    const catway = await Catway.findOne({ catwayNumber: req.params.catwayId });

    if (!catway) {
      return res.status(404).json({ message: "Catway non trouvé" });
    }

    catway.catwayType = catwayType || catway.catwayType;
    catway.catwayState = catwayState || catway.catwayState;

    await catway.save();
    res.status(200).json(catway);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du catway",
      error: err.message,
    });
  }
};

/**
 * Supprimer un catway par son numéro.
 * @param {import('express').Request} req - Objet requête Express, catwayId en params
 * @param {import('express').Response} res - Objet réponse Express
 * @returns {Promise<void>}
 */
exports.delete = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.catwayId });
    if (!catway) {
      return res.status(404).json({ message: "Catway non trouvé" });
    }

    await Catway.deleteOne({ catwayNumber: req.params.catwayId });
    res.status(200).json({ message: "Catway supprimé avec succès" });
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la suppression du catway",
      error: err.message,
    });
  }
};
