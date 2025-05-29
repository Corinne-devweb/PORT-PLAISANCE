// db/mongo.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGO_URI || "mongodb://localhost:27017/russel";

    await mongoose.connect(mongoURI); // mongoose >= 6 n’a plus besoin d’options manuelles
    console.log("✅ MongoDB connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
