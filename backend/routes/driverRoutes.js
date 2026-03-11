const express = require("express");
const router = express.Router();
const { registerDriver, getDriver, updateDriverStatus } = require("../controllers/driverController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateDriverRegistration, validateDriverStatusUpdate } = require("../middleware/validationMiddleware");

// POST /api/drivers/register - créer un profil de conducteur
router.post("/register", verifyToken, validateDriverRegistration, registerDriver);

// GET /api/drivers/profile - récupérer le profil du conducteur
router.get("/profile", verifyToken, getDriver);

// PATCH /api/drivers/status - mettre à jour disponibilité et localisation
router.patch("/status", verifyToken, validateDriverStatusUpdate, updateDriverStatus);

module.exports = router;
