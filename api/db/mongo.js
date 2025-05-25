// db/mongo.js

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.URL_MONGO || "mongodb://localhost:27017/russel"; // fallback local si variable non définie
    await mongoose.connect(mongoURI, {
      dbName: "russel", // nom de la base (utile si l'URL ne l'indique pas)
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1); // Arrête l'app si la connexion échoue
  }
};

module.exports = connectDB;
