import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Login.css";
import { toast } from "react-toastify";
import axios from "axios";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message?: string;
}

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await api.post<RegisterResponse>(
        "/auth/register",
        formData
      );

      toast.success("Registration Successful!");
      navigate("/login");
    } catch (error: unknown) {
      console.error("Registration Error:", error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Registration Failed"
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Registration Failed");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account 🛒</h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Join GreenCart and start shopping fresh groceries.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="auth-btn" type="submit">
            Create Account
          </button>
        </form>

        <div
          className="auth-link"
          style={{
            marginTop: "20px",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#2e7d32",
              fontWeight: "600",
            }}
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
}