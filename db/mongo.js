// db/mongo.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_MONGO, {
      dbName: "russel", // le nom de ta base de données
    });
    console.log("✅ MongoDB connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1); // Arrête l'app si la connexion échoue
  }
};

module.exports = connectDB;
