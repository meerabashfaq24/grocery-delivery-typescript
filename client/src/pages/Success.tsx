import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("Payment Successful!");

    const timer = setTimeout(() => {
      navigate("/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7fff5",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "50px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: "70px",
            marginBottom: "20px",
          }}
        >
          ✅
        </div>

        <h1
          style={{
            color: "#2e7d32",
            marginBottom: "15px",
            fontSize: "38px",
          }}
        >
          Payment Successful!
        </h1>

        <p
          style={{
            color: "#555",
            fontSize: "18px",
            lineHeight: "1.6",
            marginBottom: "30px",
          }}
        >
          Thank you for shopping with <strong>GreenCart</strong>.
          <br />
          Your order has been confirmed successfully.
        </p>

        <div
          style={{
            background: "#e8f5e9",
            color: "#2e7d32",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "30px",
            fontWeight: "600",
          }}
        >
          Redirecting to your orders...
        </div>

        <button
          onClick={() => navigate("/orders")}
          style={{
            background: "#2e7d32",
            color: "#fff",
            border: "none",
            padding: "15px 35px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "17px",
            fontWeight: "600",
          }}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
}