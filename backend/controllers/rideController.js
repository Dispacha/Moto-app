const db = require("../config/db");

// Créer une course et affecter automatiquement un conducteur
const createRide = async (req, res) => {
    const { pickup_lat, pickup_lng, dropoff_lat, dropoff_lng, estimated_price } = req.body;
    const client_id = req.user.id; // du JWT

    if (!pickup_lat || !pickup_lng || !dropoff_lat || !dropoff_lng) {
        return res.status(400).json({ message: "Coordonnées (pickup/dropoff) obligatoires" });
    }

    try {
        // Chercher un conducteur disponible (avec is_available = true)
        const availableDriver = await db.driver.findFirst({
            where: { isAvailable: true },
            include: { user: true }
        });

        let driver_id = null;
        if (availableDriver) {
            driver_id = availableDriver.id;
        }

        // Insérer la nouvelle course
        const ride = await db.ride.create({
            data: {
                clientId: client_id,
                driverId: driver_id,
                pickupLat: pickup_lat,
                pickupLng: pickup_lng,
                dropoffLat: dropoff_lat,
                dropoffLng: dropoff_lng,
                price: estimated_price || 0,
                status: "waiting"
            },
            include: {
                client: true,
                driver: {
                    include: { user: true }
                }
            }
        });

        // Si un conducteur a été affecté, le marquer comme occupé et notifier
        if (driver_id) {
            await db.driver.update({
                where: { id: driver_id },
                data: { isAvailable: false }
            });

            // Notifier le conducteur via Socket.IO
            req.io.to(`user_${availableDriver.userId}`).emit('new-ride', {
                ride: {
                    id: ride.id,
                    client: {
                        name: ride.client.name,
                        phone: ride.client.phone
                    },
                    pickup: { lat: ride.pickupLat, lng: ride.pickupLng },
                    dropoff: { lat: ride.dropoffLat, lng: ride.dropoffLng },
                    price: ride.price
                }
            });
        } else {
            // Notifier tous les conducteurs disponibles
            req.io.to('drivers').emit('new-ride-available', {
                ride: {
                    id: ride.id,
                    client: {
                        name: ride.client.name,
                        phone: ride.client.phone
                    },
                    pickup: { lat: ride.pickupLat, lng: ride.pickupLng },
                    dropoff: { lat: ride.dropoffLat, lng: ride.dropoffLng },
                    price: ride.price
                }
            });
        }

        res.status(201).json({
            message: "Course créée",
            ride_id: ride.id,
            driver_id: driver_id,
            status: driver_id ? "assigned" : "waiting_driver"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Erreur création course" });
    }
};

// Récupérer les détails d'une course
const getRide = async (req, res) => {
    const { ride_id } = req.params;

    try {
        const ride = await db.ride.findUnique({
            where: { id: parseInt(ride_id) },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        phone: true
                    }
                },
                driver: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });

        if (!ride) {
            return res.status(404).json({ message: "Course non trouvée" });
        }

        // Format the response to match the original structure
        const response = {
            id: ride.id,
            client_id: ride.clientId,
            driver_id: ride.driverId,
            pickup_lat: ride.pickupLat,
            pickup_lng: ride.pickupLng,
            dropoff_lat: ride.dropoffLat,
            dropoff_lng: ride.dropoffLng,
            status: ride.status,
            price: ride.price,
            created_at: ride.createdAt,
            client_name: ride.client.name,
            client_phone: ride.client.phone,
            car_model: ride.driver?.carModel,
            license_plate: ride.driver?.licensePlate,
            driver_name: ride.driver?.user?.name,
            driver_phone: ride.driver?.user?.phone
        };

        res.json(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

// Mettre à jour le statut d'une course
const updateRideStatus = async (req, res) => {
    const { ride_id } = req.params;
    const { status } = req.body;

    if (!["waiting", "assigned", "in_progress", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Statut invalide" });
    }

    try {
        const ride = await db.ride.update({
            where: { id: parseInt(ride_id) },
            data: { status },
            include: {
                client: true,
                driver: {
                    include: { user: true }
                }
            }
        });

        // Si la course est complétée ou annulée, libérer le conducteur
        if ((status === "completed" || status === "cancelled") && ride.driverId) {
            await db.driver.update({
                where: { id: ride.driverId },
                data: { isAvailable: true }
            });
        }

        // Notifier le client du changement de statut
        req.io.to(`user_${ride.clientId}`).emit('ride-status-update', {
            rideId: ride.id,
            status: status,
            driver: ride.driver ? {
                name: ride.driver.user.name,
                phone: ride.driver.user.phone,
                carModel: ride.driver.carModel
            } : null
        });

        // Notifier le conducteur si il y en a un
        if (ride.driverId) {
            req.io.to(`user_${ride.driver.userId}`).emit('ride-status-update', {
                rideId: ride.id,
                status: status,
                client: {
                    name: ride.client.name,
                    phone: ride.client.phone
                }
            });
        }

        res.json({ message: "Course mise à jour", status: status });
    } catch (err) {
        console.log(err);
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Course non trouvée" });
        }
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

// Lister les courses d'un client
const getClientRides = async (req, res) => {
    const client_id = req.user.id;

    try {
        const rides = await db.ride.findMany({
            where: { clientId: client_id },
            select: {
                id: true,
                driverId: true,
                pickupLat: true,
                pickupLng: true,
                dropoffLat: true,
                dropoffLng: true,
                status: true,
                price: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(rides);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { createRide, getRide, updateRideStatus, getClientRides };
