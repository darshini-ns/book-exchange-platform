import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
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
    setMessage("Creating your account...");
    setSuccess(false);

    try {
      const response = await API.post(
        "/auth/register",
        form
      );

      setMessage(
        response.data.message + " ✅"
      );

      setSuccess(true);

      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        error.response?.data?.message ||
          "Registration failed"
      );

      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card register-card">

        <div className="auth-logo">
          📚
        </div>

        <span className="auth-badge">
          BOOKLOOP
        </span>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join students who share, exchange and discover books.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="auth-group">
            <label>👤 Full Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="auth-group">
            <label>📱 Phone Number</label>

            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          {message && (
            <div
              className={
                success
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
            {loading
              ? "Creating Account..."
              : "Create BookLoop Account →"}
          </button>

        </form>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link
          to="/login"
          className="auth-secondary-btn"
        >
          Login to BookLoop
        </Link>

      </div>

    </div>
  );
}

export default Register;