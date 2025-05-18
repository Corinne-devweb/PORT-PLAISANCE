// services/catways.js

const Catway = require("../models/catway");

// Fonction pour lister tous les catways
exports.getAll = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération des catways");
  }
};

// Fonction pour récupérer les détails d'un catway spécifique
exports.getById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }

    res.status(200).json(catway);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération du catway");
  }
};

// Fonction pour ajouter un nouveau catway
exports.add = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    if (!catwayNumber || !catwayType || !catwayState) {
      return res.status(400).send("Tous les champs sont requis");
    }

    const newCatway = new Catway({
      catwayNumber,
      catwayType,
      catwayState,
    });

    await newCatway.save();
    res.status(201).json(newCatway);
  } catch (err) {
    res.status(500).send("Erreur lors de la création du catway");
  }
};

// Fonction pour modifier un catway existant
exports.update = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    const catway = await Catway.findOne({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }

    // Le numéro du catway ne peut pas être modifié, mais le type et l'état peuvent l'être
    catway.catwayType = catwayType || catway.catwayType;
    catway.catwayState = catwayState || catway.catwayState;

    await catway.save();
    res.status(200).json(catway);
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour du catway");
  }
};

// Fonction pour supprimer un catway
exports.delete = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }

    await catway.remove();
    res.status(200).send("Catway supprimé avec succès");
  } catch (err) {
    res.status(500).send("Erreur lors de la suppression du catway");
  }
};
