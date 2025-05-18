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
app.use(cors());

// Connexion à la base de données MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, {
      dbName: "russel",
    });
    console.log("MongoDB connecté avec succès");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API du Port de Plaisance de Russell");
});

app.get("/docs", (req, res) => {
  res.send("Documentation de l'API");
});

app.use("/api/users", userRoutes);
app.use("/api/catways", catwayRoutes);
app.use("/api/catways/:catwayNumber/reservations", reservationRoutes);

// Middleware d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Quelque chose s'est mal passé!");
});

module.exports = app;
