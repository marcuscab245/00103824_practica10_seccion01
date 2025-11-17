import express from "express";
import { verifyToken } from "../utils/middleware/index.js";

import { displayHome } from "../controllers/displayHome.js";
import { SingIn } from "../controllers/signin.js";
import { SingUp } from "../controllers/signup.js";
import { getUsers, getUserById } from "../controllers/getUsers.js";
import { updateUser } from "../controllers/updateUser.js";
import { deleteUser } from "../controllers/deleteUser.js";

import { getCustomers, searchCustomersByCode } from "../controllers/Customers.js";

import { createSale, getSalesWithCustomer } from "../controllers/sales.js";
import { getSalesReport } from "../controllers/sales.js";

const router = express.Router();

router.get("/", displayHome);
router.post("/signin", SingIn);
router.post("/signup", SingUp);

router.get("/users", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

router.get("/customers", verifyToken, getCustomers);
router.get("/customers/search", verifyToken, searchCustomersByCode);

router.post("/sales", verifyToken, createSale);
router.get("/sales", verifyToken, getSalesWithCustomer);
router.get("/sales/report", verifyToken, getSalesReport);

export default router;
