import express, { json } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import vocitRoutes from './routes/vocitRoutes.js';
import cors from "cors";


dotenv.config();
const app = express();

app.use('/uploads', express.static('uploads'));



// Middleware global
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vocits', vocitRoutes); // ✅ ajout des routes vocits


// Connexion MongoDB + Démarrage serveur
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté ✅');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Serveur démarré sur le port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error(err));
