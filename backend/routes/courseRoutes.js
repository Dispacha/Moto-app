const express = require("express");
const router = express.Router();
const { createCourse } = require("../controllers/courseController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateCourseCreation } = require("../middleware/validationMiddleware");

// POST /api/courses/create - créer une course (client authentifié)
router.post("/create", verifyToken, validateCourseCreation, createCourse);

module.exports = router;