const Catway = require("../models/catway");

/**
 * Middleware pour vérifier si un catway existe dans la base de données.
 * Recherche un catway par son numéro fourni dans les paramètres d'URL (catwayId ou id).
 * Si le catway existe, l'ajoute à `req.catway` et passe au middleware suivant.
 * Sinon, renvoie une erreur 404.
 *
 * @param {import('express').Request} req - Objet requête Express
 * @param {import('express').Response} res - Objet réponse Express
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware suivant
 */
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
    console.error("Erreur dans checkCatwayExists:", err);
    res.status(500).json({
      message: "Erreur lors de la vérification du catway",
      error: err.message,
    });
  }
};

module.exports = checkCatwayExists;
