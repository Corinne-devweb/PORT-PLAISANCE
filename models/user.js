// models/user.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Pour hasher les mots de passe

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // Le nom d'utilisateur doit être unique
    required: true,
  },
  email: {
    type: String,
    unique: true, // L'adresse e-mail doit être unique
    required: true,
    match: [/\S+@\S+\.\S+/, "Adresse e-mail invalide"], // Validation de l'email
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Le mot de passe doit faire au moins 6 caractères
  },
});

// Avant d'enregistrer un utilisateur, on hash le mot de passe
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour vérifier le mot de passe de l'utilisateur
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
