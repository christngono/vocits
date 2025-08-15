import express from 'express';
import { upload } from '../middlewares/upload.js';
import multer from 'multer';
import {
  createVocit,
  getAllVocits,
  getVocitById,
  updateVocit,
  deleteVocit,
  voteVocit,
  searchVocits,
  getVocitStats
} from '../controllers/vocitController.js';
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 Config Multer pour les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // dossier public uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});



// ✅ Créer un vocit → admin seulement
router.post('/', verifyToken, isAdmin, upload.single('image'), createVocit);

// ✅ Récupérer tous les vocits
router.get('/', getAllVocits);

// ✅ Recherche
router.get('/search', searchVocits);

// ✅ Récupérer par ID
router.get('/:id', getVocitById);

// ✅ Modifier un vocit → admin seulement
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateVocit);

// ✅ Supprimer un vocit → admin seulement
router.delete('/:id', verifyToken, isAdmin, deleteVocit);

// ✅ Voter → utilisateur connecté seulement
router.post('/:id/vote', verifyToken, voteVocit);

// ✅ Stats
router.get('/:id/stats', getVocitStats);

export default router;
