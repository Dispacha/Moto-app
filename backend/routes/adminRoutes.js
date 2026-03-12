const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Routes pour administrateur
 */

// GET tous les utilisateurs
/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Lister tous les utilisateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste utilisateurs
 */
router.get("/users", verifyToken, verifyAdmin, adminController.getAllUsers);

// GET tous les conducteurs
/**
 * @swagger
 * /api/admin/drivers:
 *   get:
 *     tags: [Admin]
 *     summary: Lister tous les conducteurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste conducteurs
 */
router.get("/drivers", verifyToken, verifyAdmin, adminController.getAllDrivers);

// GET toutes les courses
/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     tags: [Admin]
 *     summary: Lister toutes les courses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste courses
 */
router.get("/courses", verifyToken, verifyAdmin, adminController.getAllCourses);

// DELETE un utilisateur
/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Supprimer un utilisateur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 */
router.delete("/users/:id", verifyToken, verifyAdmin, adminController.deleteUser);

// DELETE un conducteur
/**
 * @swagger
 * /api/admin/drivers/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Supprimer un conducteur
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du conducteur à supprimer
 *     responses:
 *       200:
 *         description: Conducteur supprimé
 */
router.delete("/drivers/:id", verifyToken, verifyAdmin, adminController.deleteDriver);

module.exports = router;