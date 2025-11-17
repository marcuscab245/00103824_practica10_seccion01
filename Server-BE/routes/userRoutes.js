// routes/userRoutes.js
import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET: todos los usuarios
router.get("/", userController.getUsers);

// GET: usuario por ID
router.get("/:id", userController.getUserById);

// POST: crear usuario (con hash de password)
router.post("/", userController.createUser);

// PUT: actualizar usuario
router.put("/:id", verifyToken, userController.updateUser);

// DELETE: eliminar usuario
router.delete("/:id", verifyToken, userController.deleteUser);

export default router;