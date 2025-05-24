const Catway = require("../models/catway");

const checkCatwayExists = async (req, res, next) => {
  try {
    const catwayId = Number(req.params.catwayId || req.params.id);
    const catway = await Catway.findOne({ catwayNumber: catwayId });

    if (!catway) {
      return res.status(404).json({
        message: "Catway non trouvé",
        details: `catwayNumber: ${catwayId}`,
      });
    }

    req.catway = catway;
    next();
  } catch (err) {
    console.error("Erreur dans checkCatwayExists:", err); // ← Ajout important
    res.status(500).json({
      message: "Erreur lors de la vérification du catway",
      error: err.message,
    });
  }
};

module.exports = checkCatwayExists;
