import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
// Import Layout, Header, Button, Space from antd
import { Layout, Button, Space } from 'antd';
import './App.css';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import ForgotPassword from './ForgotPassword'; // Import ForgotPassword
import ResetPasswordConfirm from './ResetPasswordConfirm'; // Import ResetPasswordConfirm

function App() {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to handle initial auth check

  // Function to verify token with the backend
  const verifyToken = async (token) => {
    const API_BASE_URL = 'http://localhost:8001'; // Consider moving this to a config file
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/token/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token }),
      });
      return response.ok; // Returns true if status is 200-299
    } catch (error) {
      console.error("Error verifying token:", error);
      return false; // Network error or other issue
    }
  };

  // Check token validity on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access');
      if (token) {
        const isValid = await verifyToken(token);
        if (isValid) {
          console.log("Token is valid.");
          setIsAuthenticated(true);
        } else {
          console.log("Token is invalid or expired.");
          handleLogout(); // Clear invalid token and set state to not authenticated
        }
      }
      setIsLoading(false); // Finished auth check
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

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

  // Define styles for navigation links
  const linkStyle = {
    color: 'rgba(255, 255, 255, 0.85)', // Lighter color for links
    textDecoration: 'none',
    padding: '0 15px',
  };
  const activeLinkStyle = { // Style for the active link (optional, needs NavLink)
      ...linkStyle,
      color: '#ffffff',
      fontWeight: 'bold',
  };

  return (
    <Router basename="/panel"> {/* Add basename to handle the /panel prefix */}
      {/* Use Layout for the entire app structure */}
      <Layout className="App" style={{ minHeight: '100vh' }}>
         {/* Apply gradient background and responsive padding to the Header */}
         <Layout.Header style={{
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'space-between',
             padding: '0 50px', // Revert to fixed padding
             background: 'linear-gradient(135deg, #4a0e6c, #8a2be2)'
             }}>
            {/* Logo/Brand */}
            <div style={{ fontSize: '1.5em', color: 'white', fontWeight: 'bold' }}>
                <Link to={isAuthenticated ? "/" : "/login"} style={{ color: 'white', textDecoration: 'none' }}>Attendify</Link>
            </div>
            {/* Navigation Links/Buttons */}
            <Space size="middle">
                {isAuthenticated ? (
                    <>
                        {/* Use Button for Logout for consistency */}
                        <Button type="primary" danger onClick={handleLogout}>
                            Wyloguj
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={linkStyle}>Login</Link>
                        <Link to="/register" style={linkStyle}>Register</Link>
                    </>
                )}
            </Space>
         </Layout.Header>

         {/* Content area - Routes will render components here */}
         {/* No need for extra div or hr */}
         <Routes>
           {/* Protected Route for Dashboard */}
           <Route
            path="/"
            element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />}
          />
          {/* Login/Register routes - content will be rendered by Layout in those components */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
          />
          {/* Password Reset Routes */}
           <Route
            path="/forgot-password"
            element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/" replace />}
          />
           <Route
            path="/reset-password-confirm/:uid/:token" // Path relative to basename="/panel"
            element={!isAuthenticated ? <ResetPasswordConfirm /> : <Navigate to="/" replace />}
          />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
