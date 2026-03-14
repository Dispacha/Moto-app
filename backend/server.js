require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require('http');
const socketIo = require('socket.io');
const db = require("./config/db"); // connexion Prisma
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const driverRoutes = require("./routes/driverRoutes");
const rideRoutes = require("./routes/rideRoutes");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();

// ----------------------
// CORS configuration
// ----------------------
const allowedOrigins = [
  "https://moto-app-qk7f.onrender.com", // URL Render
  "http://localhost:3000"               // frontend local pour dev
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ----------------------
// Middleware JSON & cookies
// ----------------------
app.use(express.json());
app.use(cookieParser());

// ----------------------
// Swagger
// ----------------------
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ----------------------
// Logging simple
// ----------------------
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// ----------------------
// Attacher io à req
// ----------------------
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

// ----------------------
// Routes
// ----------------------
app.use("/api/users", userRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/rides", rideRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

console.log("Routes attachées");

// ----------------------
// Health check
// ----------------------
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ----------------------
// Middleware d'erreurs
// ----------------------
app.use(errorHandler);

// ----------------------
// Socket.IO
// ----------------------
io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Utilisateur ${userId} rejoint la room user_${userId}`);
  });
  socket.on('join-drivers', () => {
    socket.join('drivers');
    console.log('Conducteur rejoint la room drivers');
  });

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

// ----------------------
// Lancer serveur après que la DB soit prête
// ----------------------
db.ready.then(() => {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log("Serveur lancé sur le port " + PORT));
}).catch(err => {
  console.error("Erreur au démarrage:", err);
  process.exit(1);
});