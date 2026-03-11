const db = require("../config/db");

// Créer une course
const createCourse = async (req, res) => {
    // prefer authenticated client id; fall back to body.client_id for compatibility
    const client_id = (req.user && req.user.id) || req.body.client_id;
    const { depart, arrivee } = req.body;

    if (!client_id || !depart || !arrivee) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires (client_id, depart, arrivee)" });
    }

    try {
        // Chercher un conducteur disponible
        const availableDriver = await db.driver.findFirst({
            where: { isAvailable: true },
            orderBy: { id: 'asc' } // Instead of RAND(), just order by id
        });

        let driver_id = availableDriver ? availableDriver.id : null;

        // Insérer la course
        const course = await db.course.create({
            data: {
                clientId: client_id,
                driverId: driver_id,
                depart,
                arrivee,
                statut: "en attente"
            }
        });

        // Si un conducteur a été affecté, le marquer comme occupé
        if (driver_id) {
            await db.driver.update({
                where: { id: driver_id },
                data: { isAvailable: false }
            });
        }

        res.status(201).json({
            message: "Course créée",
            course: {
                id: course.id,
                client_id,
                driver_id,
                depart,
                arrivee,
                statut: "en attente"
            }
        });
    } catch (err) {
        console.log('Erreur création course Prisma:', err);
        return res.status(500).json({ message: "Erreur serveur lors de la création" });
    }
};

module.exports = { createCourse };
