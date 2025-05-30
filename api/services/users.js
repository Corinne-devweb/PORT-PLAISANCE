const User = require("../models/user");

/**
 * Créer un nouvel utilisateur.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.add = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send("Tous les champs sont requis");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Un utilisateur avec cet email existe déjà");
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Erreur création utilisateur :", err);
    res.status(500).send("Erreur serveur");
  }
};

/**
 * Récupérer la liste des utilisateurs sans les mots de passe ni tokens.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select("-password -tokens");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération des utilisateurs");
  }
};

/**
 * Récupérer un utilisateur par email (sans mot de passe ni tokens).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.getByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password -tokens"
    );
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération de l'utilisateur");
  }
};

/**
 * Mettre à jour un utilisateur (username et/ou mot de passe).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.update = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    user.username = username || user.username;
    if (password) {
      user.password = password;
    }
    await user.save();

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    res.status(200).json(userResponse);
  } catch (err) {
    res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
  }
};

/**
 * Supprimer un utilisateur par email.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
exports.delete = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ email: req.params.email });
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    res.status(200).send("Utilisateur supprimé avec succès");
  } catch (err) {
    res.status(500).send("Erreur lors de la suppression de l'utilisateur");
  }
};
