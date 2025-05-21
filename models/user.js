const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Définition du schéma pour les utilisateurs
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Le nom d'utilisateur doit être unique
      trim: true, // Supprime les espaces avant et après le nom d'utilisateur
    },
    email: {
      type: String,
      required: true,
      unique: true, // L'email doit être unique
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email invalide"], // Validation basique de l'email
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Le mot de passe doit avoir au moins 8 caractères
      select: false, // Le mot de passe ne sera pas inclus dans les requêtes de base de données
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // Ajoute les champs createdAt et updatedAt automatiquement
  }
);

// Hashage du mot de passe avant la sauvegarde de l'utilisateur
userSchema.pre("save", async function (next) {
  const user = this;

  // Si le mot de passe est modifié, on le hache
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Méthode pour générer un token d'authentification
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  // Création du token JWT
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  // Enregistrement du token dans l'utilisateur
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Méthode pour comparer le mot de passe fourni avec celui stocké
userSchema.methods.comparePassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

// Suppression des données sensibles (mot de passe, tokens) avant d'envoyer l'objet utilisateur
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password; // Supprimer le mot de passe
  delete user.tokens; // Supprimer les tokens
  return user;
};

// Création du modèle User
module.exports = mongoose.model("User", userSchema);
