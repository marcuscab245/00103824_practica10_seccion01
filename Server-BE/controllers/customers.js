import { pool } from '../data/conection.js';

// Ejercicio 2: Listado básico de clientes
export const getCustomers = async (req, res) => {
    try {
        // Consulta: SELECT * FROM customers; [cite: 141]
        const query = 'SELECT id, name, address, phone, code FROM customers ORDER BY id ASC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

// Ejercicio 5: Buscar clientes por código
export const searchCustomersByCode = async (req, res) => {
    // Ruta: GET /api/customers/search?code=XYZ [cite: 167]
    const { code } = req.query; 
    if (!code) {
        return res.status(400).json({ message: 'Code parameter is required' });
    }
    try {
        // Consulta: SELECT * FROM customers WHERE code = $1; [cite: 168]
        const query = 'SELECT id, name, address, phone, code FROM customers WHERE code = $1';
        const result = await pool.query(query, [code]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error searching customers by code:', error);
        res.status(500).json({ message: 'Error searching customers by code', error: error.message });
    }
};