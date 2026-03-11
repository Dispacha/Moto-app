const express = require("express");
const router = express.Router();
const { createRide, getRide, updateRideStatus, getClientRides } = require("../controllers/rideController");
const { verifyToken } = require("../middleware/authMiddleware");
const { validateRideCreation } = require("../middleware/validationMiddleware");

// POST /api/rides - créer une course
router.post("/", verifyToken, validateRideCreation, createRide);

// GET /api/rides - lister les courses du client authentifié
router.get("/", verifyToken, getClientRides);

// GET /api/rides/:ride_id - détails d'une course
router.get("/:ride_id", verifyToken, getRide);

// PATCH /api/rides/:ride_id/status - mettre à jour le statut
router.patch("/:ride_id/status", verifyToken, updateRideStatus);

module.exports = router;
