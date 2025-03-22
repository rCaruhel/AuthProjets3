const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.register = async (req, res) => {
    try {
        const { displayName, password } = req.body;

        // Vérifie si l'utilisateur existe déjà
        const existingUser = await User.findOne({ displayName });
        if (existingUser) return res.status(400).json({ message: "L'utilisateur existe déjà" });

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({ displayName, encryptedPassword: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.login = async (req, res) => {
    try {
        const { displayName, password } = req.body;

        // Vérifie si l'utilisateur existe
        const user = await User.findOne({ displayName });
        if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

        // Compare le mot de passe envoyé avec le mot de passe hashé dans la base de données
        const isMatch = await bcrypt.compare(password, user.encryptedPassword);
        if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

        // Utilisation de Passport pour gérer la session
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ message: "Erreur lors de la connexion", error: err });
            }

            // Si tout est bon, on renvoie une réponse
            res.status(200).json({ message: "Connexion réussie", user });
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};