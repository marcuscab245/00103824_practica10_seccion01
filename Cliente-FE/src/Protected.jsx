import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Importante: Protected ahora acepta { children } como argumento.
const Protected = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Obtener el token del almacenamiento local.
    const token = localStorage.getItem('token'); 
    
    // 2. Si el token existe, se considera autenticado para el propósito del laboratorio.
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
    // 3. Finaliza el estado de carga.
    setLoading(false);
  }, []);

  // Muestra un mensaje de carga mientras se verifica el token.
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Verificando sesión...</div>;
  }

  // 4. Si NO está autenticado, redirigir a la página de login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; 
  }

  // 5. Si está autenticado, renderizar los componentes que están envueltos (los children).
  // ESTO ES LO QUE PERMITE VER CustomerList, SalesList, etc.
  return children; 
};

export default Protected;