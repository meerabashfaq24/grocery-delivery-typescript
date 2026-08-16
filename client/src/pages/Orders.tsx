import { useEffect, useState } from "react";
import api from "../services/api";
import "./Products.css";

interface Order {
  _id: string;
  status: string;
  products: unknown[];
  address?: string;
  totalPrice: number | string;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get<Order[]>("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <div className="products-page">
      <h1 className="products-title">My Orders</h1>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
          <h2>No Orders Yet 📦</h2>
          <p>Your orders will appear here after checkout.</p>
        </div>
      ) : (
        <div className="products-grid">
          {orders.map((order) => (
            <div
              key={order._id}
              className="product-card"
              style={{
                padding: "30px",
                textAlign: "left",
              }}
            >
              <div className="product-content">
                <h2
                  className="product-name"
                  style={{
                    color: "#222",
                    fontWeight: "700",
                    marginBottom: "15px",
                  }}
                >
                  🧾 Order #{order._id.slice(-6).toUpperCase()}
                </h2>

                <p style={{ margin: "15px 0" }}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      background:
                        order.status === "Confirmed"
                          ? "#e8f5e9"
                          : "#fff3cd",
                      color:
                        order.status === "Confirmed"
                          ? "#2e7d32"
                          : "#ff9800",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontWeight: "600",
                    }}
                  >
                    {order.status}
                  </span>
                </p>

                <p style={{ marginBottom: "12px" }}>
                  🛒 <strong>Items:</strong> {order.products.length}
                </p>

                <p
                  style={{
                    marginTop: "15px",
                    marginBottom: "15px",
                    color: "#555",
                    lineHeight: "1.6",
                  }}
                >
                  <strong>📍 Delivery Address:</strong>
                  <br />
                  {order.address || "No address provided"}
                </p>

                <h2
                  style={{
                    color: "#2e7d32",
                    marginTop: "20px",
                    fontSize: "30px",
                  }}
                >
                  ${Number(order.totalPrice).toFixed(2)}
                </h2>

                <p style={{ color: "#777" }}>Total Amount</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}