import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'; // Import Navigate
import './App.css';
import Login from './Login';
import Register from './Register'; // Dodano import Register
import Dashboard from './Dashboard'; // Dodano import Dashboard

function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to handle initial auth check

  // Check for token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      // Basic check: assumes token presence means authenticated.
      // TODO: Add token validation logic here (e.g., check expiry, verify with backend)
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Finished initial check
  }, []);

  // Function to handle successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
    // No need to manually set localStorage here, Login component does it
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    // Optionally redirect to login page after logout using useNavigate if needed elsewhere
  };

  // Show loading indicator or null while checking auth status
  if (isLoading) {
    return <div>Loading...</div>; // Or a proper spinner component
  }

  return (
    <Router> {/* Usunięto basename="/panel" */}
      <div className="App">
        <nav>
          <ul>
            {isAuthenticated ? (
              <>
                <li><Link to="/">Dashboard</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
        <hr />
        <Routes>
          {/* Protected Route for Dashboard */}
          <Route
            path="/"
            element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          {/* Redirect Login/Register if already authenticated */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
          />
          {/* Add other routes here */}
          {/* Fallback route for unknown paths (optional) */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
