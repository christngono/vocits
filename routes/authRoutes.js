// routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Gestion de l'authentification
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pseudo
 *               - phone
 *               - password
 *               - confirmPassword
 *               - region
 *             properties:
 *               pseudo:
 *                 type: string
 *                 example: JohnDoe
 *               phone:
 *                 type: string
 *                 example: 612345678
 *               password:
 *                 type: string
 *                 example: "Test@1234"
 *               confirmPassword:
 *                 type: string
 *                 example: "Test@1234"
 *               region:
 *                 type: string
 *                 example: Centre
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur dans les données envoyées
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: 612345678
 *               password:
 *                 type: string
 *                 example: "Test@1234"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Mauvais identifiants
 */
router.post('/login', login);

export default router;
