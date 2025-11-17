import { pool } from '../data/conection.js';

// Helper: Valida que id_customer exista en customers. [cite: 150]
const customerExists = async (id_customer) => {
    const result = await pool.query('SELECT 1 FROM customers WHERE id = $1', [id_customer]);
    return result.rows.length > 0;
};

// Ejercicio 3: Registrar una nueva venta
export const createSale = async (req, res) => {
    const { amount, id_customer } = req.body;
    
    if (!amount || !id_customer || isNaN(parseFloat(amount))) {
        return res.status(400).json({ message: 'Amount and id_customer are required and amount must be a valid number.' });
    }

    try {
        const exists = await customerExists(id_customer);
        if (!exists) {
            return res.status(404).json({ message: `Customer with ID ${id_customer} not found.` });
        }

        // Insertar en sales con amount y created_at (usar NOW()). [cite: 151]
        const query = 'INSERT INTO sales (amount, id_customer, created_at) VALUES ($1, $2, NOW()) RETURNING *';
        const result = await pool.query(query, [parseFloat(amount), id_customer]);
        
        res.status(201).json({ message: 'Sale registered successfully', sale: result.rows[0] }); // [cite: 155]
    } catch (error) {
        console.error('Error creating sale:', error);
        res.status(500).json({ message: 'Error creating sale', error: error.message });
    }
};

// Ejercicio 4: Listar ventas con datos del cliente
export const getSalesWithCustomer = async (req, res) => {
    try {
        // Consulta con JOIN[cite: 159]:
        // SELECT s.id, s.amount, s.created_at, c.name FROM sales s JOIN customers c ON s.id_customer = c.id; [cite: 160, 161, 162]
        const query = `
            SELECT 
                s.id, 
                s.amount, 
                s.created_at, 
                c.name 
            FROM sales s 
            JOIN customers c ON s.id_customer = c.id
            ORDER BY s.created_at DESC`;
            
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching sales:', error);
        res.status(500).json({ message: 'Error fetching sales', error: error.message });
    }
};

// Ejercicio 6: Reporte de ventas por cliente
export const getSalesReport = async (req, res) => {
    try {
        // Consulta con GROUP BY y SUM[cite: 175, 176, 177, 178]:
        // SELECT c.name, SUM(s.amount) AS total_sales FROM sales s JOIN customers c ON s.id_customer = c.id GROUP BY c.name;
        const query = `
            SELECT 
                c.name, 
                SUM(s.amount) AS total_sales
            FROM sales s
            JOIN customers c ON s.id_customer = c.id
            GROUP BY c.name
            ORDER BY total_sales DESC`;
            
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching sales report:', error);
        res.status(500).json({ message: 'Error fetching sales report', error: error.message });
    }
};