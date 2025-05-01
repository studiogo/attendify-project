import React, { useState } from "react";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api/auth/register/' 
        : 'https://attendify.pl/api/auth/register/';
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password,
          password2: password,
          username: email
        }),
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Rejestracja nie powiodła się");
      }
      const data = await response.json();
      if (onRegister) onRegister();
    } catch (err) {
      setError(err.message || "Błąd rejestracji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label>Hasło:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Rejestrowanie..." : "Zarejestruj się"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default Register;
