// routes/authRoutes.js
import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// POST: signin 
router.post("/signin", authController.signin);

// POST: signup 
router.post("/signup", authController.signup);

export default router;