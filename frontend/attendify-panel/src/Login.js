import React, { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Nieprawidłowy email lub hasło");
      }
      const data = await response.json();
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      if (onLogin) onLogin();
    } catch (err) {
      setError(err.message || "Błąd logowania");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Logowanie</h2>
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
            autoComplete="current-password"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj się"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
