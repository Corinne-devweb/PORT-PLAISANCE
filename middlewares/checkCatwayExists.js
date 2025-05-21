const Catway = require("../models/catway");

const checkCatwayExists = async (req, res, next) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: req.params.id });

    if (!catway) {
      return res.status(404).send("Catway non trouvé");
    }

    // Ajoute le catway à la requête pour l'utiliser dans le service si nécessaire
    req.catway = catway;

    next(); // Passe à la route suivante
  } catch (err) {
    res.status(500).send("Erreur lors de la vérification du catway");
  }
};

module.exports = checkCatwayExists;
