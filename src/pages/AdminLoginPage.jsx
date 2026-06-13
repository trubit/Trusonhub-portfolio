import { useState } from "react";

import { Alert, Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { loginRequest } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import "../styles/adminLogin.css";


export const AdminLoginPage = () => {
  const navigate  = useNavigate();
  const setAuth   = useAuthStore((state) => state.setAuth);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginRequest({ email: email.trim(), password });
      setAuth({ token: data.token, user: data.user });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-page">
      <Container className="admin-login-container">
        <div className="admin-login-card">
          <h1 className="admin-login-title">Admin Login</h1>
          <p className="admin-login-subtitle">
            Sign in to manage your portfolio content, media, projects, and messages.
          </p>

          {error && (
            <Alert variant="danger" className="admin-login-alert">
              {error}
            </Alert>
          )}

          <Form className="admin-login-form" onSubmit={onSubmit}>
            <Form.Control
              aria-label="Email"
              className="admin-login-input"
              name="email"
              placeholder="Admin Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
              autoComplete="email"
            />

            <Form.Control
              aria-label="Password"
              className="admin-login-input"
              name="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              className="admin-login-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </Form>
        </div>
      </Container>
    </section>
  );
};
