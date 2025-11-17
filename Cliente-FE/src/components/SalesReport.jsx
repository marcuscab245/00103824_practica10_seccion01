import React, { useState, useEffect } from 'react';
import API from '../utils/api.js';

const SalesReport = () => {
    const [report, setReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            setError(null);
            try {
                // Consumir el endpoint GET /api/sales/report [cite: 173]
                const response = await API.get('/api/sales/report');
                setReport(response.data);
            } catch (err) {
                console.error('Error fetching sales report:', err);
                setError('Error fetching sales report. Make sure the backend is running and you are logged in.');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, []);

    if (loading) return <p>Loading sales report...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="container">
            <h2>Sales Report by Customer</h2>
            {/* Mostrar una tabla con: Cliente | Total Ventas [cite: 180] */}
            {report.length === 0 ? (
                <p>No sales data found for the report.</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Total Sales</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((item) => (
                            <tr key={item.name}>
                                <td>{item.name}</td>
                                <td>${parseFloat(item.total_sales).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table >
            )}
        </div>
    );
};

export default SalesReport;