const express = require("express")
const router = express.Router()
console.log("userRoutes chargé, router type:", typeof router);
const { registerUser, loginUser, getCurrentUser } = require("../controllers/userController")
const { validateRegisterUser, validateLogin } = require("../middleware/validationMiddleware")
const { verifyToken } = require("../middleware/authMiddleware")

console.log("enregistrement des routes /register et /login");

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Créer un utilisateur
 *     description: Permet de créer un utilisateur client ou conducteur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [client, driver]
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post("/register", validateRegisterUser, registerUser)

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Permet à un utilisateur de se connecter avec son email et mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 */
router.post("/login", validateLogin, loginUser)

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer l'utilisateur connecté
 *     description: Renvoie les informations de l'utilisateur actuellement connecté
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur
 */
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Obtenir les informations de l'utilisateur connecté
 *     tags:
 *       - Utilisateurs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Infos utilisateur récupérées
 */
router.get("/me", verifyToken, getCurrentUser)

module.exports = router