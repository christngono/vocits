// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// Fonction pour vérifier la force du mot de passe
function isStrongPassword(password) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return regex.test(password);
}

// Fonction pour vérifier le format du téléphone
function isValidPhone(phone) {
  const regex = /^6\d{8}$/; // commence par 6 + 8 chiffres = total 9
  return regex.test(phone);
}

// Génération du token JWT
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ==================== REGISTER ====================

export const register = async (req, res) => {
  try {
    const { pseudo, phone, password, confirmPassword, region, role } = req.body;

    if (!pseudo || !phone || !password || !confirmPassword || !region) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier que le mot de passe correspond à confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    // Vérification format téléphone
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Le numéro doit commencer par 6 et contenir exactement 9 chiffres.",
      });
    }

    // Vérification mot de passe fort
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message:
          "Le mot de passe doit contenir au moins 8 caractères, avec majuscule, minuscule, chiffre et symbole.",
      });
    }

    // Vérification unicité pseudo et phone
    const pseudoExist = await User.findOne({ pseudo });
    if (pseudoExist) {
      return res.status(400).json({ message: "Ce pseudo est déjà pris." });
    }

    const phoneExist = await User.findOne({ phone });
    if (phoneExist) {
      return res.status(400).json({ message: "Ce numéro est déjà utilisé." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = await User.create({
      pseudo,
      phone,
      password: hashedPassword,
      region,
      role: role || "user",
    });

    const token = generateToken(newUser);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: {
        id: newUser._id,
        pseudo: newUser.pseudo,
        phone: newUser.phone,
        region: newUser.region,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur Register:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Numéro et mot de passe requis" });
    }

    // Vérification format téléphone
    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Le numéro doit commencer par 6 et contenir exactement 9 chiffres.",
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur introuvable" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = generateToken(user);

    res.json({
      message: "Connexion réussie",
      user: {
        id: user._id,
        pseudo: user.pseudo,
        region: user.region,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur Login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
