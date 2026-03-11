const db = require("../config/db");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || "1h"; // e.g. '1h'
const REFRESH_EXPIRES_DAYS = parseInt(process.env.REFRESH_DAYS || "7", 10);
const REFRESH_EXPIRES_MS = REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000;

function generateRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

function createAccessToken(user) {
  const payload = { id: user.id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: ACCESS_EXPIRES });
}

// exchange login flow already handled in userController.loginUser which will
// store a refresh token. Here we implement refresh and logout endpoints.

const refreshToken = async (req, res) => {
  const token = req.cookies && req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return res.status(401).json({ message: "Refresh token manquant" });

  try {
    const refreshTokenRecord = await db.refreshToken.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!refreshTokenRecord) return res.status(401).json({ message: "Refresh token invalide" });
    if (refreshTokenRecord.revoked) return res.status(401).json({ message: "Refresh token révoqué" });
    if (new Date(refreshTokenRecord.expiresAt) < new Date()) return res.status(401).json({ message: "Refresh token expiré" });

    const user = refreshTokenRecord.user;
    const accessToken = createAccessToken(user);

    // rotate refresh token: revoke old, insert new
    const newRefresh = generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_MS);

    await db.refreshToken.update({
      where: { id: refreshTokenRecord.id },
      data: { revoked: true }
    });

    await db.refreshToken.create({
      data: {
        token: newRefresh,
        userId: user.id,
        expiresAt
      }
    });

    // set cookie and return access token
    res.cookie("refreshToken", newRefresh, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: REFRESH_EXPIRES_MS });
    res.json({ token: accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const logout = async (req, res) => {
  const token = req.cookies && req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return res.status(400).json({ message: "Refresh token manquant" });

  try {
    await db.refreshToken.updateMany({
      where: { token },
      data: { revoked: true }
    });

    res.clearCookie("refreshToken");
    res.json({ message: "Déconnecté" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { refreshToken, logout, createAccessToken, generateRefreshToken };