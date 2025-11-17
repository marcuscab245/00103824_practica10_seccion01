// app.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Configuración de middlewares
app.use(bodyParser.json());
app.use(cors());

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: "Bienvenido a la API" });
});

// Registro de rutas
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

// Ruta protegida de ejemplo
import { verifyToken } from "./middleware/auth.js";
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected data accessed", user: req.user });
});

export default app;