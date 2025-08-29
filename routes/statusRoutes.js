import express from "express";
import multer from "multer";
import {
  createStatus,
  getAllStatus,
  getStatusById,
  updateStatus,
  deleteStatus,
} from "../controllers/statusController.js";

const router = express.Router();

// 📌 Config Multer pour uploader dans "uploadsstatus/"
const storage = multer.diskStorage({
  destination: "uploadsstatus/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ------------------ Swagger ------------------

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: Gestion des statuts (image/vidéo)
 */

/**
 * @swagger
 * /api/status:
 *   post:
 *     summary: Créer un nouveau status
 *     tags: [Status]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Mon premier status"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Status créé avec succès
 *       400:
 *         description: Champs manquants ou invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/", upload.single("file"), createStatus);

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Récupérer tous les status
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Liste des status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   image:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Erreur serveur
 */
router.get("/", getAllStatus);

/**
 * @swagger
 * /api/status/{id}:
 *   get:
 *     summary: Récupérer un status par ID
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du status
 *     responses:
 *       200:
 *         description: Status trouvé
 *       404:
 *         description: Status introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get("/:id", getStatusById);

/**
 * @swagger
 * /api/status/{id}:
 *   put:
 *     summary: Mettre à jour un status
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du status
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nouveau titre du status"
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Status mis à jour
 *       404:
 *         description: Status introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put("/:id", upload.single("file"), updateStatus);

/**
 * @swagger
 * /api/status/{id}:
 *   delete:
 *     summary: Supprimer un status
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du status
 *     responses:
 *       200:
 *         description: Status supprimé avec succès
 *       404:
 *         description: Status introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete("/:id", deleteStatus);

export default router;
