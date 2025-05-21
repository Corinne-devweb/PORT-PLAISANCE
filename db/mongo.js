// DB/mongo.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "russel", // tu peux aussi le passer via .env si besoin
    });
    console.log("✅ MongoDB connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1); // Arrête l'app si la DB ne se connecte pas
  }
};

module.exports = connectDB;
