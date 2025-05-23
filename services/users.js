const User = require("../models/user");

// Création utilisateur (sans générer le token ici)
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

    // On crée directement l'utilisateur : le hash sera fait automatiquement dans le modèle
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

// Liste utilisateurs sans mot de passe ni tokens
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select("-password -tokens");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send("Erreur lors de la récupération des utilisateurs");
  }
};

// Récupérer utilisateur par email sans mot de passe ni tokens
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

// Mise à jour utilisateur (sans modifier l'email)
exports.update = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }
    user.username = username || user.username;
    if (password) {
      user.password = password; // Laisse le modèle hasher automatiquement
    }
    await user.save();

    // Ne jamais renvoyer password ni tokens !
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

// Suppression utilisateur
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
