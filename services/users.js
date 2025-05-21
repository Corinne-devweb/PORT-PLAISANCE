// services/users.js

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Fonction pour créer un utilisateur
exports.add = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation des champs requis
    if (!username || !email || !password) {
      return res.status(400).send("Tous les champs sont requis");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Un utilisateur avec cet email existe déjà");
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).send("Erreur lors de la création de l'utilisateur");
  }
};

// Fonction pour lister tous les utilisateurs
exports.getAll = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération des utilisateurs");
  }
};

// Fonction pour récupérer un utilisateur par email
exports.getByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération de l'utilisateur");
  }
};

// Fonction pour mettre à jour un utilisateur
exports.update = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    user.username = username || user.username;
    user.email = email || user.email;

    // Si le mot de passe est modifié, on le hash avant de le mettre à jour
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
  }
};

// Fonction pour supprimer un utilisateur
exports.delete = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    await user.remove();
    res.status(200).send("Utilisateur supprimé avec succès");
  } catch (err) {
    res.status(500).send("Erreur lors de la suppression de l'utilisateur");
  }
};
