const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const db = require("../config/db"); // Prisma client


/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gestion administrative
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Liste tous les utilisateurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get("/users", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const users = await db.user.findMany({
      include: { driver: true, clientRides: true, clientCourses: true },
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/drivers:
 *   get:
 *     summary: Liste tous les conducteurs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des conducteurs
 */
router.get("/drivers", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const drivers = await db.driver.findMany({
      include: { user: true, driverRides: true, driverCourses: true },
    });
    res.json(drivers);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/courses:
 *   get:
 *     summary: Liste toutes les courses
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des courses
 */
router.get("/courses", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const courses = await db.course.findMany({
      include: { client: true, driver: true },
    });
    res.json(courses);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/admin/rides:
 *   get:
 *     summary: Liste toutes les rides
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rides
 */
router.get("/rides", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const rides = await db.ride.findMany({
      include: { client: true, driver: true },
    });
    res.json(rides);
  } catch (err) {
    next(err);
  }
});

module.exports = router;