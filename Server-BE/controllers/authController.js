// controllers/authController.js
import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

// POST: signin (login)
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email y contraseña son requeridos" 
      });
    }

    // Buscar usuario por email
    const result = await pool.query(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Verificar password con bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        name: user.name 
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error en signin:", error);
    res.status(500).json({ error: "Error en el proceso de autenticación" });
  }
};

// POST: signup (registro alternativo)
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Nombre, correo y contraseña son requeridos" 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    // Validar longitud mínima de password
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

    // Verificar si el email ya existe
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "El email ya está registrado" });
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

    // Insertar usuario
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, hashedPassword]
    );

    const newUser = result.rows[0];

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        name: newUser.name 
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: newUser
    });
  } catch (error) {
    console.error("Error en signup:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};