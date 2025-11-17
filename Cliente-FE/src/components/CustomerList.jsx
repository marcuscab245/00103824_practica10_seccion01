import React, { useState, useEffect } from 'react';
import API from '../utils/api.js';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchCustomers = async (url) => {
        setLoading(true);
        setError(null);
        try {
            const response = await API.get(url);
            setCustomers(response.data);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Error fetching customers. Make sure the backend is running and you are logged in.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Cargar todos los clientes al inicio (Ejercicio 2) [cite: 143]
        fetchCustomers('/api/customers');
    }, []);

    // Manejar la búsqueda por código (Ejercicio 5) [cite: 166]
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            // Ruta: /api/customers/search?code=XYZ [cite: 167]
            fetchCustomers(`/api/customers/search?code=${searchTerm.trim()}`);
        } else {
            // Si el campo de búsqueda está vacío, mostrar todos.
            fetchCustomers('/api/customers');
        }
    };

    if (loading && customers.length === 0) return <p>Loading customers...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="container">
            <h2>Customer List</h2>

            {/* Formulario de búsqueda (Ejercicio 5) */}
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Code (XYZ)"
                />
                <button type="submit">Search Customer</button>
            </form>

            {/* Tabla de resultados (Ejercicio 2 y 5) [cite: 143] */}
            {customers.length === 0 ? (
                <p>No customers found.</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>{customer.name}</td>
                                <td>{customer.address}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.code}</td>
                            </tr>
                        ))}
                    </tbody>
                </table >
            )}
        </div>
    );
};

export default CustomerList;