// app.js

// 1. Charger les variables d'environnement
require("dotenv").config({ path: `env/.env.${process.env.NODE_ENV || "dev"}` });

const express = require("express");
const cors = require("cors");
const path = require("path");

// 2. Import de la connexion MongoDB centralisée
const connectDB = require("./DB/mongo");

// 3. Import du routeur principal
const routes = require("./routes");

const app = express();

// 4. Middlewares globaux
app.use(cors());
app.use(express.json()); // remplace body-parser
app.use(express.static("public")); // si tu as un frontend

// 5. Connexion à MongoDB
connectDB();

// 6. Routes
app.use("/api", routes);

// 7. Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Une erreur est survenue !");
});

// 8. Port d’écoute
const PORT = process.env.PORT || 3081;
app.listen(PORT, () => {
  console.log(
    `✅ Serveur en écoute sur le port ${PORT} (${process.env.NODE_ENV})`
  );
});

module.exports = app;
