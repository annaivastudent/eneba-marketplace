
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  loginUser,
  type AuthUser,
} from "../../../services/authService";
import "../../../styles/auth/Login.css";

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await loginUser({
        email,
        password,
      });

      if (result.user) {
        onLogin(result.user);
        setSuccess(`Welcome, ${result.user.name}!`);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome back!</h1>
        <p>Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <label htmlFor="login-email">Email</label>

          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="login-password">Password</label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && (
            <p className="login-error">{error}</p>
          )}

          {success && (
            <p className="login-success">{success}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="login-register">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
