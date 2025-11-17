import { db } from "../data/connection.js";

export const createSale = async (req, res) => {
  try {
    const { amount, id_customer } = req.body;

    if (amount == null || id_customer == null) {
      return res.status(400).json({ success:false, message:"amount and id_customer are required" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ success:false, message:"amount must be > 0" });
    }

    try {
      const c = await db.query("SELECT 1 FROM customers WHERE id = $1", [id_customer]);
      if (c.rowCount === 0) return res.status(400).json({ success:false, message:"id_customer not found" });
    } catch (e) {
      if (e.code === "42P01") {
        const c2 = await db.query("SELECT 1 FROM clientes WHERE id_cliente = $1", [id_customer]);
        if (c2.rowCount === 0) return res.status(400).json({ success:false, message:"id_customer not found" });
      } else {
        throw e;
      }
    }

    try {
      const q = `
        INSERT INTO sales (amount, created_at, id_customer)
        VALUES ($1, NOW(), $2)
        RETURNING id, amount, created_at, id_customer`;
      const r = await db.query(q, [amount, id_customer]);
      return res.status(201).json({ success:true, data:r.rows[0] });
    } catch (e) {
      if (e.code === "42P01") {
        const q2 = `
          INSERT INTO ventas (monto, fecha, id_cliente)
          VALUES ($1, NOW(), $2)
          RETURNING id_venta AS id, monto AS amount, fecha AS created_at, id_cliente AS id_customer`;
        const r2 = await db.query(q2, [amount, id_customer]);
        return res.status(201).json({ success:true, data:r2.rows[0] });
      }
      throw e;
    }
  } catch (e) {
    return res.status(500).json({ success:false, message:"DB error", detail:e.message });
  }
};

export const getSalesWithCustomer = async (req, res) => {
  try {
    const q = `
      SELECT
        s.id, s.amount, s.created_at, s.id_customer,
        c.name AS customer_name
      FROM sales s
      JOIN customers c ON c.id = s.id_customer
      ORDER BY s.id ASC`;
    const { rows } = await db.query(q);
    return res.status(200).json({ success: true, data: rows });
  } catch (e) {
    if (e.code === "42P01") {
      const q2 = `
        SELECT
          v.id_venta   AS id,
          v.monto      AS amount,
          v.fecha      AS created_at,
          v.id_cliente AS id_customer,
          c.nombre     AS customer_name
        FROM ventas v
        JOIN clientes c ON c.id_cliente = v.id_cliente
        ORDER BY v.id_venta ASC`;
      const { rows } = await db.query(q2);
      return res.status(200).json({ success: true, data: rows });
    }
    return res.status(500).json({ success: false, message: "DB error", detail: e.message });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const q = `
      SELECT
        c.id   AS customer_id,
        c.name AS customer_name,
        COALESCE(SUM(s.amount), 0)::NUMERIC(12,2) AS total_sales
      FROM customers c
      LEFT JOIN sales s ON s.id_customer = c.id
      GROUP BY c.id, c.name
      ORDER BY c.id ASC`;
    const { rows } = await db.query(q);
    return res.status(200).json({ success: true, data: rows });
  } catch (e) {
    if (e.code === "42P01") {
      const q2 = `
        SELECT
          c.id_cliente AS customer_id,
          c.nombre     AS customer_name,
          COALESCE(SUM(v.monto), 0)::NUMERIC(12,2) AS total_sales
        FROM clientes c
        LEFT JOIN ventas v ON v.id_cliente = c.id_cliente
        GROUP BY c.id_cliente, c.nombre
        ORDER BY c.id_cliente ASC`;
      const { rows } = await db.query(q2);
      return res.status(200).json({ success: true, data: rows });
    }
    return res.status(500).json({ success:false, message:"DB error", detail:e.message });
  }
};


