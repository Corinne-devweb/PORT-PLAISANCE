const Catway = require("../models/catway");

const checkCatwayExists = async (req, res, next) => {
  try {
    // Utilisation de req.params.catwayId au lieu de req.params.id
    const catway = await Catway.findOne({
      catwayNumber: req.params.catwayId || req.params.id,
    });

    if (!catway) {
      return res.status(404).json({
        message: "Catway non trouvé",
        details: `CatwayNumber: ${req.params.catwayId || req.params.id}`,
      });
    }

    // Ajoute le catway complet à la requête
    req.catway = catway;
    next();
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la vérification du catway",
      error: err.message,
    });
  }
};

module.exports = checkCatwayExists;
