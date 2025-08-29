/**
 * @swagger
 * tags:
 *   name: Vocits
 *   description: Gestion des vocits (votes citoyens)
 */

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

} from '../controllers/vocitController.js';
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Vocit:
 *       type: object
 *       required:
 *         - image
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: ID du vocit
 *         image:
 *           type: string
 *           description: URL de l'image
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         categorie:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         votePour:
 *           type: number
 *         voteContre:
 *           type: number
 *         voteAbstention:
 *           type: number
 *         datePublication:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/vocits:
 *   post:
 *     summary: Créer un nouveau vocit (admin seulement)
 *     tags: [Vocits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Vocit créé
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifyToken, isAdmin, upload.single('image'), createVocit);

/**
 * @swagger
 * /api/vocits:
 *   get:
 *     summary: Récupérer tous les vocits
 *     tags: [Vocits]
 *     responses:
 *       200:
 *         description: Liste des vocits
 */
router.get('/all', getAllVocits);

/**
 * @swagger
 * /api/vocits/all:
 *   get:
 *     summary: Récupérer tous les vocits avec leurs statistiques
 *     tags: [Vocits]
 *     responses:
 *       200:
 *         description: Liste de tous les vocits avec leurs informations et statistiques de votes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "66d0e9d2a2e9..."
 *                   titre:
 *                     type: string
 *                     example: "Mon premier vocit"
 *                   description:
 *                     type: string
 *                     example: "Lorem ipsum dolor sit amet"
 *                   votePour:
 *                     type: integer
 *                     example: 10
 *                   voteContre:
 *                     type: integer
 *                     example: 5
 *                   voteAbstention:
 *                     type: integer
 *                     example: 2
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   stats:
 *                     type: object
 *                     properties:
 *                       totalVotes:
 *                         type: integer
 *                         example: 17
 *                       pour:
 *                         type: object
 *                         properties:
 *                           count:
 *                             type: integer
 *                             example: 10
 *                           percentage:
 *                             type: number
 *                             format: float
 *                             example: 58.82
 *                       contre:
 *                         type: object
 *                         properties:
 *                           count:
 *                             type: integer
 *                             example: 5
 *                           percentage:
 *                             type: number
 *                             format: float
 *                             example: 29.41
 *                       abstention:
 *                         type: object
 *                         properties:
 *                           count:
 *                             type: integer
 *                             example: 2
 *                           percentage:
 *                             type: number
 *                             format: float
 *                             example: 11.76
 *       500:
 *         description: Erreur lors de la récupération des vocits
 */

router.get('/search', searchVocits);

/**
 * @swagger
 * /api/vocits/{id}:
 *   get:
 *     summary: Récupérer un vocit par ID
 *     tags: [Vocits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vocit trouvé
 *       404:
 *         description: Vocit introuvable
 */
router.get('/:id', getVocitById);

/**
 * @swagger
 * /api/vocits/{id}:
 *   put:
 *     summary: Mettre à jour un vocit (admin seulement)
 *     tags: [Vocits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Vocit mis à jour
 *       404:
 *         description: Vocit introuvable
 */
router.put('/:id', verifyToken, isAdmin, upload.single('image'), updateVocit);

/**
 * @swagger
 * /api/vocits/{id}:
 *   delete:
 *     summary: Supprimer un vocit (admin seulement)
 *     tags: [Vocits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vocit supprimé
 *       404:
 *         description: Vocit introuvable
 */
router.delete('/:id', verifyToken, isAdmin, deleteVocit);

/**
 * @swagger
 * /api/vocits/{id}/vote:
 *   post:
 *     summary: Voter pour un vocit (utilisateur connecté)
 *     tags: [Vocits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               choice:
 *                 type: string
 *                 enum: [pour, contre, abstention]
 *     responses:
 *       200:
 *         description: Vote enregistré
 *       400:
 *         description: Choix invalide
 */
router.post('/:id/vote', verifyToken, voteVocit);

/**
 * @swagger
 * /api/vocits/{id}/stats:
 *   get:
 *     summary: Obtenir les statistiques de vote d'un vocit
 *     tags: [Vocits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistiques de votes
 *       404:
 *         description: Vocit introuvable
 */


export default router;
