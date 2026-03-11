const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { generateRefreshToken, createAccessToken } = require("./authController");

// création utilisateur avec hash de mot de passe
const registerUser = async (req, res) => {
    const { name, phone, password, role } = req.body;

    if(!name || !phone || !password || !role){
        return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = await db.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
                role
            }
        });

        res.status(201).json({ message: "Utilisateur créé", userId: user.id });
    } catch (err) {
        console.log(err);
        if (err.code === 'P2002') {
            return res.status(400).json({ message: "Ce numéro de téléphone est déjà utilisé" });
        }
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

// connexion : vérifie phone + password et renvoie un JWT
const loginUser = async (req, res) => {
    const { phone, password } = req.body;
    if(!phone || !password) {
        return res.status(400).json({ message: "Phone et mot de passe requis" });
    }

    try {
        const user = await db.user.findUnique({
            where: { phone }
        });

        if (!user) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const valid = bcrypt.compareSync(password, user.password);
        if(!valid) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const accessToken = createAccessToken(user);

        // create refresh token, store it in DB and set HttpOnly cookie
        const refreshToken = generateRefreshToken();
        const expiresAt = new Date(Date.now() + (parseInt(process.env.REFRESH_DAYS || "7", 10) * 24 * 60 * 60 * 1000));

        await db.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt
            }
        });

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: expiresAt - Date.now() });
        res.json({ token: accessToken, user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await db.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { registerUser, loginUser, getCurrentUser };