// app.js

// Import des dépendances
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import des routes
const userRoutes = require("./routes/users");
const catwayRoutes = require("./routes/catways");
const reservationRoutes = require("./routes/reservations");

// Chargement du fichier .env
dotenv.config();

// Initialisation de l'application Express
const app = express();

// Middleware de gestion du corps des requêtes JSON
app.use(bodyParser.json());

// CORS : Permet les requêtes depuis d'autres domaines (cross-origin requests)
app.use(cors());

// Connexion à la base de données MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "port_plaisance",
    });
    console.log("MongoDB connecté avec succès");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error);
    process.exit(1); // Arrêt de l'application si la connexion échoue
  }
};

// Connexion à la base de données
connectDB();

// Route de la page d'accueil (root)
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API du Port de Plaisance de Russell");
});

// Route de la documentation de l'API (ajouter un lien si tu utilises un outil comme Swagger)
app.get("/docs", (req, res) => {
  res.send("Documentation de l'API");
});

// Routes pour les utilisateurs
app.use("/api/users", userRoutes);

// Routes pour les catways
app.use("/api/catways", catwayRoutes);

// Routes pour les réservations
app.use("/api/catways/:catwayNumber/reservations", reservationRoutes);

// Middleware pour gérer les erreurs non gérées
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Quelque chose s'est mal passé!");
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});
