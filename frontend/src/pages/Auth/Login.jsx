import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error("Please enter your email");
    }

    if (!password.trim()) {
      return toast.error("Please enter your password");
    }

    try {
      setLoading(true);

      const res = await API.post("/login", {
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("token", res.data.token);

        toast.success("Login successful");

        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-brand">
          <div className="login-brand-icon">
            ✓
          </div>

          <h1>TaskFlow</h1>

          <p>
            Organize your tasks, track progress and get more done every day.
          </p>
        </div>

        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your task dashboard.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-form-group">
              <label htmlFor="email">Email Address</label>

              <div className="login-input-wrapper">
                <FaEnvelope className="login-input-icon" />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="login-form-group">
              <div className="login-password-label">
                <label htmlFor="password">Password</label>

                <Link to="/forgot-password">
                  Forgot password?
                </Link>
              </div>

              <div className="login-input-wrapper">
                <FaLock className="login-input-icon" />

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              <FaSignInAlt />

              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-register-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
