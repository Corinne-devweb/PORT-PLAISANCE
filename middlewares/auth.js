const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send("Accès refusé. Veuillez vous connecter.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On ajoute l'utilisateur décodé à la requête
    next(); // On passe à la prochaine fonction (la route)
  } catch (err) {
    res.status(400).send("Token invalide.");
  }
};

module.exports = authMiddleware;
