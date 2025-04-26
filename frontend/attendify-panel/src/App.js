  import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register'; // Dodano import Register
import Dashboard from './Dashboard'; // Dodano import Dashboard

// Usunięto nieużywany komponent Home

function App() {
  return (
    <Router> {/* Usunięto basename="/panel" */}
      <div className="App">
        <nav>
          <ul>
            {/* Przykładowe linki nawigacyjne */}
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
        <hr />
        <Routes>
          {/* Przywrócono oryginalne komponenty */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
