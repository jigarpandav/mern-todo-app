import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API from "../../services/api";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return toast.error("Please enter your name");
    }

    if (!email.trim()) {
      return toast.error("Please enter your email");
    }

    if (!password.trim()) {
      return toast.error("Please enter your password");
    }

    try {
      setLoading(true);

      const res = await API.post("/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (res.status === 201) {
        toast.success(
          res.data.message || "Account created successfully"
        );

        navigate("/");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">

        <div className="register-brand">
          <div className="register-brand-icon">
            ✓
          </div>

          <h1>TaskFlow</h1>

          <p>
            Create your account and start organizing your tasks,
            tracking progress, and getting more done every day.
          </p>
        </div>

        <div className="register-card">

          <div className="register-header">
            <h2>Create Account</h2>

            <p>
              Enter your information to get started with TaskFlow.
            </p>
          </div>

          <form
            className="register-form"
            onSubmit={handleRegister}
          >

            <div className="register-form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <div className="register-input-wrapper">
                <FaUser className="register-input-icon" />

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <div className="register-input-wrapper">
                <FaEnvelope className="register-input-icon" />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="register-form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="register-input-wrapper">
                <FaLock className="register-input-icon" />

                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >
              <FaUserPlus />

              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          <div className="register-login-text">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;