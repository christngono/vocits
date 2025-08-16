// testMongo.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // charge ton .env

const uri = process.env.MONGO_URI;

async function testConnection() {
  try {
    console.log("🔌 Tentative de connexion à MongoDB...");
    await mongoose.connect(uri); // plus besoin des options dépréciées
    console.log("✅ Connexion MongoDB réussie !");
    process.exit(0); // quitte proprement
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error.message);
    process.exit(1);
  }
}

testConnection();
