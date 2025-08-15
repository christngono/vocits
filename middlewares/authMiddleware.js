import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Vérifie que l'utilisateur est connecté
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Accès refusé : token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contient { id, pseudo, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

// Vérifie que l'utilisateur est admin
export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé : réservé aux administrateurs" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur" });
  }
};
