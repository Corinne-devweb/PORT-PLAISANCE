// app.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db/mongo");
const routes = require("./routes");
const { swaggerUi, specs } = require("./swagger");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));

connectDB();

app.use("/api", routes);

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Une erreur est survenue !");
});

const PORT = process.env.PORT || 4010;
app.listen(PORT, () => {
  console.log(
    `✅ Serveur en écoute sur le port ${PORT} (${process.env.NODE_ENV})`
  );
});

module.exports = app;
