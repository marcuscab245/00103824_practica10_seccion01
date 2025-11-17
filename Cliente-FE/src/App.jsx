import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Login.jsx";
import Protected from "./Protected.jsx"; // Asumo que este componente existe
// Importar nuevos componentes
import CustomerList from "./components/CustomerList.jsx";
import SalesList from "./components/SalesList.jsx";
import RegisterSale from "./components/RegisterSale.jsx";
import SalesReport from "./components/SalesReport.jsx";

// Nota: He añadido un componente <nav> simple para facilitar la navegación en la interfaz.
// Además, he envuelto los nuevos componentes en <Protected> asumiendo que quieres protegerlos.
const App = () => (
  <Router>
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
        <Link to="/customers">Customers</Link> | 
        <Link to="/sales/register">Register Sale</Link> | 
        <Link to="/sales">Sales List</Link> | 
        <Link to="/sales/report">Sales Report</Link> |
        <Link to="/protected">Protected Home</Link> |
        <Link to="/login">Login</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas Protegidas de la Guía 10 */}
      <Route path="/protected" element={<Protected />} /> 
      <Route path="/customers" element={<Protected><CustomerList /></Protected>} /> 
      <Route path="/sales" element={<Protected><SalesList /></Protected>} />
      <Route path="/sales/register" element={<Protected><RegisterSale /></Protected>} />
      <Route path="/sales/report" element={<Protected><SalesReport /></Protected>} />

    </Routes>
  </Router>
);

export default App;