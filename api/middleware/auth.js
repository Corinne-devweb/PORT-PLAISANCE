const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification JWT.
 * Vérifie la présence et la validité du token JWT dans le header Authorization.
 * Si le token est valide, ajoute les données décodées dans `req.user` et passe au middleware suivant.
 * Sinon, renvoie une erreur 401 ou 403 selon le cas.
 *
 * @param {import('express').Request} req - Objet requête Express
 * @param {import('express').Response} res - Objet réponse Express
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware suivant
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Accès refusé. Token manquant ou mal formaté.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).send("Token invalide ou expiré.");
  }
};

module.exports = authMiddleware;
