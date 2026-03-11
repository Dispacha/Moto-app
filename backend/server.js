require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require('http');
const socketIo = require('socket.io');
const db = require("./config/db");         // connexion Prisma
console.log("DB chargé");
const userRoutes = require("./routes/userRoutes");  // routes utilisateur
const driverRoutes = require("./routes/driverRoutes");  // routes conducteurs
const rideRoutes = require("./routes/rideRoutes");  // routes courses
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
console.log("Routes chargées");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // À adapter selon votre frontend
    methods: ["GET", "POST"]
  }
});

// middlewares
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use(cors());
app.use(express.json());  // pour lire JSON du body
app.use(cookieParser());

// Attacher io à req pour l'utiliser dans les routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/users", userRoutes); // routes utilisateurs
app.use("/api/drivers", driverRoutes); // routes conducteurs
app.use("/api/rides", rideRoutes); // routes courses/trajets
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
console.log("Routes attachées");

// Route de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de gestion d'erreurs (doit être le dernier)
app.use(errorHandler);

// Configuration Socket.IO
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  // Rejoindre une room basée sur l'ID utilisateur
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Utilisateur ${userId} rejoint la room user_${userId}`);
  });

  // Rejoindre la room des conducteurs
  socket.on('join-drivers', () => {
    socket.join('drivers');
    console.log('Conducteur rejoint la room drivers');
  });

  // Mettre à jour la position du conducteur
  socket.on('update-driver-position', async (data) => {
    const { driverId, lat, lng } = data;
    if (!driverId || typeof lat !== 'number' || typeof lng !== 'number') return;

    try {
      await db.driver.update({
        where: { id: driverId },
        data: { latitude: lat, longitude: lng, lastLocationUpdate: new Date() }
      });
      console.log(`Position mise à jour pour conducteur ${driverId}: ${lat}, ${lng}`);
    } catch (err) {
      console.error('Erreur mise à jour position conducteur:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

// attendre que la DB soit prête avant de démarrer
db.ready.then(() => {
  const PORT = 5000;
  server.listen(PORT, () => console.log("Serveur lancé sur le port " + PORT));
}).catch(err => {
  console.error("Erreur au démarrage:", err);
  process.exit(1);
});