const express = require("express");
const router = express.Router();
const { createRide, getRide, updateRideStatus, getClientRides } = require("../controllers/rideController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateRideCreation } = require("../middleware/validationMiddleware");

// POST /api/rides - créer une course
/**
 * @swagger
 * /api/rides:
 *   post:
 *     summary: Créer une course
 *     description: Permet à un client authentifié de créer une nouvelle course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupLocation
 *               - dropoffLocation
 *             properties:
 *               pickupLocation:
 *                 type: string
 *               dropoffLocation:
 *                 type: string
 *               driverId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course créée avec succès
 *       400:
 *         description: Données invalides
 */
router.post("/", verifyToken, validateRideCreation, createRide);

// GET /api/rides - lister les courses du client authentifié
/**
 * @swagger
 * /api/rides:
 *   get:
 *     summary: Lister les courses du client
 *     description: Récupère toutes les courses associées au client authentifié
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des courses récupérée
 *       401:
 *         description: Non autorisé
 */
router.get("/", verifyToken, getClientRides);

// GET /api/rides/:ride_id - détails d'une course
/**
 * @swagger
 * /api/rides/{ride_id}:
 *   get:
 *     summary: Détails d'une course
 *     description: Récupère les informations d'une course spécifique par son ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ride_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la course
 *     responses:
 *       200:
 *         description: Détails de la course récupérés
 *       404:
 *         description: Course non trouvée
 */
router.get("/:ride_id", verifyToken, getRide);

// PATCH /api/rides/:ride_id/status - mettre à jour le statut
/**
 * @swagger
 * /api/rides/{ride_id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une course
 *     description: Permet de changer le statut d'une course (en cours, terminée, annulée…)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ride_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Course non trouvée
 */
router.patch("/:ride_id/status", verifyToken, updateRideStatus);

module.exports = router;
