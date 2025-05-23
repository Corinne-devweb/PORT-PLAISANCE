const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    select: false, // Ne pas renvoyer le mot de passe par défaut
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware pour hasher le mot de passe avant chaque sauvegarde (création ou update)
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Méthode pour générer un JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

// Méthode pour comparer un mot de passe (en clair) avec le hash stocké
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
