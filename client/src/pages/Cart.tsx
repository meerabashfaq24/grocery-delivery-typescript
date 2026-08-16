import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import "./Products.css";
import { toast } from "react-toastify";

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

interface CartItem {
  _id: string;
  product: CartProduct;
  quantity: number;
}

interface OrderProduct {
  product: string;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [address, setAddress] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async (): Promise<void> => {
    try {
      const res = await api.get<CartItem[]>("/cart");

      console.log("Cart API:", res.data);

      setCart(res.data);
    } catch (error: unknown) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || error.message
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to load cart");
      }
    }
  };

  const removeItem = async (id: string): Promise<void> => {
    try {
      await api.delete(`/cart/${id}`);
      await fetchCart();
      toast.success("Item Removed");
    } catch (error: unknown) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || error.message
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to remove item");
      }
    }
  };

  const placeOrder = async (): Promise<void> => {
    try {
      const products: OrderProduct[] = cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

      const totalPrice = cart.reduce(
        (total, item) =>
          total + item.product.price * item.quantity,
        0
      );

      if (paymentMethod === "cod") {
        await api.post("/orders", {
          products,
          totalPrice,
          address,
        });

        toast.success("Order Placed Successfully!");
        navigate("/orders");
      } else {
        const res = await api.post<{ url: string }>("/orders/stripe", {
          products,
          totalPrice,
          address,
        });

        window.location.replace(res.data.url);
      }
    } catch (error: unknown) {
      console.log(error);

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || error.message
        );
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="products-page">
      <h1 className="products-title">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "70px 20px",
          }}
        >
          <h2>Your cart is empty 🛒</h2>
          <p>Add some delicious groceries to get started.</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {cart.map((item) => (
              <div
                key={item._id}
                className="product-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  padding: "20px",
                  minHeight: "160px",
                }}
              >
                <img
                  src={
                    item.product?.image ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600"
                  }
                  alt={item.product?.name}
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    margin: "20px auto 0",
                    display: "block",
                  }}
                />

                <div
                  className="product-content"
                  style={{
                    flex: 1,
                    padding: "0",
                  }}
                >
                  <div className="product-name">
                    {item.product?.name}
                  </div>

                  <div className="stock">
                    Quantity: {item.quantity}
                  </div>

                  <div className="price">
                    ${item.product?.price}
                  </div>

                  <button
                    className="add-btn"
                    onClick={() => removeItem(item._id)}
                    style={{
                      background: "#d32f2f",
                      width: "140px",
                      padding: "10px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              margin: "50px auto",
              maxWidth: "450px",
              background: "#fff",
              borderRadius: "18px",
              padding: "30px",
              boxShadow: "0 8px 24px rgba(0,0,0,.08)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color: "#2e7d32",
                fontSize: "32px",
                marginBottom: "25px",
              }}
            >
              Total: ${total.toFixed(2)}
            </h2>

            <div
              style={{
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  marginBottom: "18px",
                  fontSize: "22px",
                }}
              >
                Choose Payment Method
              </h3>

              <h3
                style={{
                  marginBottom: "12px",
                  fontSize: "22px",
                }}
              >
                Delivery Address
              </h3>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                  resize: "none",
                  marginBottom: "25px",
                  fontSize: "16px",
                  boxSizing: "border-box",
                }}
              />

              <label
                style={{
                  marginRight: "30px",
                  fontWeight: "600",
                }}
              >
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />
                {" "}Cash on Delivery
              </label>

              <label
                style={{
                  fontWeight: "600",
                }}
              >
                <input
                  type="radio"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value)
                  }
                />
                {" "}Stripe
              </label>
            </div>

            <button
              className="add-btn"
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "18px",
                marginTop: "25px",
              }}
              onClick={placeOrder}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}