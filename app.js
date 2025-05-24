// app.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db/mongo");
const routes = require("./routes");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000", // ton front React
  credentials: true, // autoriser cookies/session
};

app.use(cors(corsOptions)); // <-- ici la config correcte

app.use(express.json());
app.use(express.static("public"));

connectDB();

app.use("/api", routes);

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
