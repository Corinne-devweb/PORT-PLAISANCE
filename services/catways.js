const Catway = require("../models/catway");

// Lister tous les catways
exports.getAll = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.status(200).json(catways);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la récupération des catways : " + err.message);
  }
};

// Détails d’un catway
exports.getById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).send("Catway non trouvé");
    res.status(200).json(catway);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la récupération du catway : " + err.message);
  }
};

// Ajouter un nouveau catway
exports.add = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;
    if (!catwayNumber || !catwayType || !catwayState) {
      return res.status(400).send("Tous les champs sont requis");
    }

    const existing = await Catway.findOne({ catwayNumber });
    if (existing) {
      return res.status(400).send("Un catway avec ce numéro existe déjà");
    }

    const newCatway = new Catway({ catwayNumber, catwayType, catwayState });
    await newCatway.save();
    res.status(201).json(newCatway);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la création du catway : " + err.message);
  }
};

// Modifier un catway (sans changer son numéro)
exports.update = async (req, res) => {
  try {
    const { catwayType, catwayState } = req.body;

    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).send("Catway non trouvé");

    catway.catwayType = catwayType || catway.catwayType;
    catway.catwayState = catwayState || catway.catwayState;

    await catway.save();
    res.status(200).json(catway);
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour : " + err.message);
  }
};

// Supprimer un catway
exports.delete = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });
    if (!catway) return res.status(404).send("Catway non trouvé");

    await Catway.deleteOne({ catwayNumber: req.params.id });
    res.status(200).send("Catway supprimé avec succès");
  } catch (err) {
    res.status(500).send("Erreur lors de la suppression : " + err.message);
  }
};
