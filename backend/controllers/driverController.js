const db = require("../config/db");

// Enregistrer/créer un profil de conducteur
const registerDriver = async (req, res) => {
    const { car_model, license_plate } = req.body;
    const user_id = req.user.id; // du JWT

    if (!car_model || !license_plate) {
        return res.status(400).json({ message: "Modèle de voiture et plaque obligatoires" });
    }

    try {
        const driver = await db.driver.create({
            data: {
                userId: user_id,
                carModel: car_model,
                licensePlate: license_plate,
                isAvailable: true
            }
        });

        res.status(201).json({
            message: "Profil conducteur créé",
            driver_id: driver.id
        });
    } catch (err) {
        console.log(err);
        if (err.code === 'P2002') {
            return res.status(400).json({ message: "Ce profil conducteur existe déjà ou plaque doublon" });
        }
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

// Récupérer le profil d'un conducteur
const getDriver = async (req, res) => {
    const user_id = req.user.id;

    try {
        const driver = await db.driver.findUnique({
            where: { userId: user_id },
            select: {
                id: true,
                userId: true,
                carModel: true,
                licensePlate: true,
                isAvailable: true
            }
        });

        if (!driver) {
            return res.status(404).json({ message: "Profil conducteur non trouvé" });
        }

        res.json(driver);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

// Mettre à jour la disponibilité et la localisation
const updateDriverStatus = async (req, res) => {
    const { is_available, latitude, longitude } = req.body;
    const user_id = req.user.id;

    try {
        const updateData = {};

        if (is_available !== undefined) {
            updateData.isAvailable = is_available;
        }
        if (latitude !== undefined && longitude !== undefined) {
            updateData.latitude = latitude;
            updateData.longitude = longitude;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Aucun champ à mettre à jour" });
        }

        const driver = await db.driver.update({
            where: { userId: user_id },
            data: updateData
        });

        res.json({ message: "Statut du conducteur mis à jour" });
    } catch (err) {
        console.log(err);
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Conducteur non trouvé" });
        }
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { registerDriver, getDriver, updateDriverStatus };
