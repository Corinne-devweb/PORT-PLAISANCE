const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Schéma mongoose pour un utilisateur
 * @typedef {Object} User
 * @property {string} username - Nom d'utilisateur (min 3 caractères, obligatoire)
 * @property {string} email - Email unique et valide (obligatoire)
 * @property {string} password - Mot de passe hashé (min 6 caractères, obligatoire, non sélectionné par défaut)
 * @property {Date} createdAt - Date de création de l'utilisateur (automatique)
 */

/**
 * @typedef {Object} UserMethods
 * @property {function(): string} generateAuthToken - Génère un token JWT contenant id, email et username, valide 24h
 * @property {function(string): Promise<boolean>} comparePassword - Compare un mot de passe en clair avec le hash stocké
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Le nom d'utilisateur est obligatoire"],
    trim: true,
    minlength: [3, "Le nom d'utilisateur doit contenir au moins 3 caractères"],
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, "Merci de fournir un email valide"],
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
    select: false, // IMPORTANT : ne jamais renvoyer le password dans les requêtes normales
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware pour hasher le mot de passe avant chaque sauvegarde
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

/**
 * Génère un JWT signé avec les infos de l'utilisateur
 * @returns {string} Token JWT valide 24h
 */
userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email, username: this.username },
    process.env.SECRET_KEY,
    { expiresIn: "24h" }
  );
};

/**
 * Compare un mot de passe en clair avec le hash stocké
 * @param {string} candidatePassword - Mot de passe à comparer
 * @returns {Promise<boolean>} Résultat de la comparaison
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
