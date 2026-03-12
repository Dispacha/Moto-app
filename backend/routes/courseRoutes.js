const express = require("express");
const router = express.Router();
const { createCourse } = require("../controllers/courseController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateCourseCreation } = require("../middleware/validationMiddleware");

// POST /api/courses/create - créer une course (client authentifié)
/**
 * @swagger
 * /api/courses/create:
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
 *     responses:
 *       200:
 *         description: Course créee avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé
 */
router.post("/create", verifyToken, validateCourseCreation, createCourse);

module.exports = router;