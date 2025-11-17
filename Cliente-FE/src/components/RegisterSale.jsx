import React, { useState } from 'react';
import API from '../utils/api.js';

const RegisterSale = () => {
    // Formulario con campos: amount, id_customer. [cite: 154]
    const [formData, setFormData] = useState({
        amount: '',
        id_customer: '',
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!formData.amount || !formData.id_customer) {
            setError('Both Amount and Customer ID are required.');
            return;
        }

        try {
            // Llamar al endpoint POST /api/sales [cite: 149]
            const response = await API.post('/api/sales', {
                amount: parseFloat(formData.amount),
                id_customer: parseInt(formData.id_customer),
            });
            
            // Mostrar mensaje de éxito si se guarda la información. [cite: 155]
            setMessage(response.data.message);
            setFormData({ amount: '', id_customer: '' }); 
        } catch (err) {
            console.error('Error registering sale:', err);
            setError(err.response?.data?.message || 'Error registering sale. Check console for details.');
        }
    };

    return (
        <div className="container">
            <h2>Register New Sale</h2>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        step="0.01"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="id_customer">Customer ID:</label>
                    <input
                        type="number"
                        id="id_customer"
                        name="id_customer"
                        value={formData.id_customer}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Register Sale</button>
            </form>
            {message && <p className="success">{message} 🎉</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default RegisterSale;