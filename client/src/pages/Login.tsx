import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import "./Login.css";
import { toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    role?: string;
  };
}

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const res = await api.post<LoginResponse>(
        "/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful!");

      navigate("/products");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Login Failed"
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login Failed");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back 👋</h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Login to continue shopping fresh groceries.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            className="auth-btn"
            type="submit"
          >
            Login
          </button>
        </form>

        <div
          className="auth-link"
          style={{
            marginTop: "20px",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#2e7d32",
              fontWeight: "600",
            }}
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}