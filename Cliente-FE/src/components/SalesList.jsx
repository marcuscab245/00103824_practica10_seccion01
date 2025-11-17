import React, { useState, useEffect } from 'react';
import API from '../utils/api.js';

const SalesList = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSales = async () => {
            setLoading(true);
            setError(null);
            try {
                // Consumir el endpoint GET /api/sales [cite: 158]
                const response = await API.get('/api/sales');
                setSales(response.data);
            } catch (err) {
                console.error('Error fetching sales:', err);
                setError('Error fetching sales. Make sure the backend is running and you are logged in.');
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    if (loading) return <p>Loading sales list...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="container">
            <h2>Sales List (with Customer Name)</h2>
            {/* Mostrar: ID venta, monto, fecha, nombre del cliente. [cite: 164] */}
            {sales.length === 0 ? (
                <p>No sales registered.</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Sale ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Customer Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id}>
                                <td>{sale.id}</td>
                                <td>${parseFloat(sale.amount).toFixed(2)}</td>
                                <td>{new Date(sale.created_at).toLocaleString()}</td>
                                <td>{sale.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table >
            )}
        </div>
    );
};

export default SalesList;