const express = require("express");
const router = express.Router();
const { registerDriver, getDriver, updateDriverStatus } = require("../controllers/driverController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateDriverRegistration, validateDriverStatusUpdate } = require("../middleware/validationMiddleware");

// POST /api/drivers/register - créer un profil de conducteur
/**
 * @swagger
 * /api/drivers/register:
 *   post:
 *     summary: Créer un conducteur
 *     description: Permet à un utilisateur autorisé de créer un profil conducteur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Conducteur créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post("/register", verifyToken, validateDriverRegistration, registerDriver);

// GET /api/drivers/profile
/**
 * @swagger
 * /api/drivers/profile:
 *   get:
 *     summary: Obtenir le profil du conducteur
 *     description: Récupère les informations du conducteur connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *       401:
 *         description: Non autorisé
 */
router.get("/profile", verifyToken, getDriver);

// PATCH /api/drivers/status - mettre à jour disponibilité et localisation
/**
 * @swagger
 * /api/drivers/status:
 *   patch:
 *     summary: Mettre à jour le statut du conducteur
 *     description: Permet de mettre à jour la disponibilité et la localisation du conducteur
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                   lng:
 *                     type: number
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       401:
 *         description: Non autorisé
 */
router.patch("/status", verifyToken, validateDriverStatusUpdate, updateDriverStatus);

module.exports = router;
