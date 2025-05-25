// routes/index.js

const express = require("express");
const router = express.Router();

// Import des fichiers de routes spécifiques
const userRoutes = require("./users");
const catwayRoutes = require("./catways");
const reservationRoutes = require("./reservations");

// Routes principales
router.use("/users", userRoutes);
router.use("/catways", catwayRoutes);
router.use("/reservations", reservationRoutes);

module.exports = router;
