const express = require('express');
const router = express.Router();
const { refreshToken, logout } = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renouveler le token
 *     description: Permet de générer un nouveau token pour l'utilisateur authentifié
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renouvelé avec succès
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Déconnexion
 *     description: Déconnecte l'utilisateur et invalide le token
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', logout);

module.exports = router;