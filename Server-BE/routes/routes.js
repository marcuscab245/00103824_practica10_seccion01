import express from "express";
import { verifyToken } from "../middleware/Index.js";
import { getUsers, getUserById } from "../controllers/getUsers.js";
import { createUser } from "../controllers/createUsers.js";
import { updateUser } from "../controllers/updateUsers.js";
import { deleteUser } from "../controllers/deleteUsers.js";
import { displayHome } from "../controllers/displayHome.js";
// Nuevos Controllers
import { getCustomers, searchCustomersByCode } from "../controllers/customers.js"; 
import { createSale, getSalesWithCustomer, getSalesReport } from "../controllers/sales.js";

const router = express.Router();

import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../Keys/keys.js";

// Ruta de login de prueba: devuelve un token válido para cualquier usuario/contraseña
router.post("/signin", (req, res) => {
	const { username = "test" } = req.body;
	const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
	res.json({ token });
});

router.get("/", displayHome);
router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/users", verifyToken, createUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

// Rutas de Ejercicios Guía 10 (Protected with verifyToken)
// Ejercicio 2: Listado básico de clientes [cite: 140]
router.get("/api/customers", verifyToken, getCustomers); 

// Ejercicio 3: Registrar una nueva venta [cite: 149]
router.post("/api/sales", verifyToken, createSale); 

// Ejercicio 4: Listar ventas con datos del cliente [cite: 158]
router.get("/api/sales", verifyToken, getSalesWithCustomer); 

// Ejercicio 5: Buscar clientes por código [cite: 167]
router.get("/api/customers/search", verifyToken, searchCustomersByCode); 

// Ejercicio 6: Reporte de ventas por cliente [cite: 173]
router.get("/api/sales/report", verifyToken, getSalesReport); 


export default router;