import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import vocitRoutes from './routes/vocitRoutes.js';
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const app = express();

// 📌 Middleware global
app.use(express.json());

// 📌 CORS global pour l'API
app.use(cors({ origin: '*' })); // tu peux restreindre à ton frontend plus tard

// 📌 Dossier public pour les fichiers uploadés
// 🔹 CORS spécifique pour /uploads afin que les images soient accessibles partout
app.use('/uploads', cors(), express.static('uploads'));

// 📌 Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Vocit Documentation",
      version: "1.0.0",
      description: "Documentation interactive de l'API Vocit",
    },
    servers: [
      { url: "http://localhost:5000" },
      { url: "https://huit.onrender.com" } // 🔹 URL production
    ],
  },
  apis: ["./routes/*.js"], // 🔹 Analyse les fichiers de routes pour JSDoc
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// 📌 Route Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 📌 Route pour télécharger le fichier JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// 📌 Routes API
app.use('/api/auth', authRoutes);
app.use('/api/vocits', vocitRoutes);

// 📌 Connexion MongoDB + Démarrage serveur
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté ✅');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Serveur démarré sur le port ${process.env.PORT || 5000}`)
    );
    console.log("📄 Swagger UI disponible sur /api-docs");
    console.log("📦 Fichier JSON disponible sur /api-docs.json");
  })
  .catch(err => console.error(err));
