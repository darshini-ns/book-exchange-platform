import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("Logging in...");

    try {
      const response = await API.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      setMessage("Login successful! ✅");

      setTimeout(() => {
        navigate("/home");
      }, 700);
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message ||
          "Cannot connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          📚
        </div>

        <span className="auth-badge">
          BOOKLOOP
        </span>

        <h1>Welcome Back!</h1>

        <p className="auth-subtitle">
          Login to continue your book-sharing journey.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="auth-group">
            <label>📧 Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-group">
            <label>🔒 Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <div
              className={
                message.includes("successful")
                  ? "auth-message success"
                  : "auth-message"
              }
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login to BookLoop →"}
          </button>

        </form>

        <div className="auth-divider">
          <span>New to BookLoop?</span>
        </div>

        <Link
          to="/register"
          className="auth-secondary-btn"
        >
          Create New Account
        </Link>

      </div>

    </div>
  );
}

export default Login;