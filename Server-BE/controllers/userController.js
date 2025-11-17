// controllers/userController.js
import pool from "../db.js";
import bcrypt from "bcrypt";
import { config } from "../config/config.js";

// GET: todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users ORDER BY id ASC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// GET: usuario por ID
export const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// POST: crear usuario con password hasheado
export const createUser = async (req, res) => {
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

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// PUT: actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, password } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Verificar que al menos un campo esté presente
    if (!name && !email && !password) {
      return res.status(400).json({ 
        error: "Debe proporcionar al menos un campo para actualizar" 
      });
    }

    // Construir query dinámicamente
    let query = "UPDATE users SET ";
    const values = [];
    let paramCount = 1;

    if (name) {
      query += `name = $${paramCount}, `;
      values.push(name);
      paramCount++;
    }

    if (email) {
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Email inválido" });
      }
      query += `email = $${paramCount}, `;
      values.push(email);
      paramCount++;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS);
      query += `password = $${paramCount}, `;
      values.push(hashedPassword);
      paramCount++;
    }

    // Remover última coma y espacio
    query = query.slice(0, -2);
    
    query += ` WHERE id = $${paramCount} RETURNING id, name, email, created_at`;
    values.push(id);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario actualizado exitosamente",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// DELETE: eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ 
      message: `Usuario con ID ${id} eliminado exitosamente` 
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};