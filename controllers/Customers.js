import { db } from "../data/connection.js";

export const getCustomers = async (req, res) => {
  try {
    const q = `
      SELECT id, name, address, phone, code
      FROM customers
      ORDER BY id ASC`;
    const { rows } = await db.query(q);
    return res.status(200).json({ success: true, data: rows });
  } catch (e) {
    return res.status(500).json({ success: false, message: "DB error (customers)", detail: e.message });
  }
};

export const searchCustomersByCode = async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ success:false, message:"Missing ?code" });

  try {
    const q = `
      SELECT id, name, address, phone, code
      FROM customers
      WHERE code = $1`;
    const { rows } = await db.query(q, [code]);
    return res.status(200).json({ success:true, data: rows });
  } catch (e) {
    if (e.code === "42P01") {
      const q2 = `
        SELECT id_cliente AS id, nombre AS name, direccion AS address, telefono AS phone, codigo AS code
        FROM clientes
        WHERE codigo = $1`;
      const { rows } = await db.query(q2, [code]);
      return res.status(200).json({ success:true, data: rows });
    }
    return res.status(500).json({ success:false, message:"DB error", detail:e.message });
  }
};




