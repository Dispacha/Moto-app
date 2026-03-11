const express = require("express")
const router = express.Router()
console.log("userRoutes chargé, router type:", typeof router);
const { registerUser, loginUser, getCurrentUser } = require("../controllers/userController")
const { validateRegisterUser, validateLogin } = require("../middleware/validationMiddleware")
const { verifyToken } = require("../middleware/authMiddleware")

console.log("enregistrement des routes /register et /login");
router.post("/register", validateRegisterUser, registerUser)
router.post("/login", validateLogin, loginUser)
router.get("/me", verifyToken, getCurrentUser) // Route pour obtenir les infos de l'utilisateur connecté

module.exports = router