import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./Products.css";
import { toast } from "react-toastify";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  image?: string;
  category: string;
  description?: string;
  price: number | string;
  stock: number;
}

type Category =
  | "Fruits"
  | "Vegetables"
  | "Dairy"
  | "Bakery"
  | "Meat"
  | "Grocery";

const productImages: Record<string, string> = {
  Apple:
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800",
  Bananas:
    "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800",
  Tomatoes:
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800",
  Potatoes:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800",
  "Whole Milk":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800",
  Eggs:
    "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800",
  "Brown Bread":
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
  Chicken:
    "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800",
  "Basmati Rice":
    "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=800",
};

const categoryMap: Record<Category, string[]> = {
  Fruits: ["Apple", "Bananas"],
  Vegetables: ["Tomatoes", "Potatoes"],
  Dairy: ["Whole Milk", "Eggs"],
  Bakery: ["Brown Bread"],
  Meat: ["Chicken"],
  Grocery: ["Basmati Rice"],
};

const categoryNames: Record<string, string> = {
  "6a681ba15eeed5fa012455f5": "🍎 Fruits",
  "6a681bf65eeed5fa012455f7": "🥦 Vegetables",
  "6a6a8151d72c8e24e79b288b": "🥛 Dairy",
  "6a6a8181d72c8e24e79b288c": "🍞 Bakery",
  "6a6a819cd72c8e24e79b288d": "🍗 Meat",
  "6a6a81b0d72c8e24e79b288e": "🍚 Grocery",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      const res = await api.get<Product[]>("/products");

      let data = res.data;

      if (
        selectedCategory &&
        Object.prototype.hasOwnProperty.call(
          categoryMap,
          selectedCategory
        )
      ) {
        const category = selectedCategory as Category;

        data = data.filter((product: Product) =>
          categoryMap[category].includes(product.name)
        );
      }

      setProducts(data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      await api.post("/cart", {
        product: productId,
        quantity: 1,
      });

      toast.success("Added to Cart!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        toast.error(
          error.response?.data?.message ||
            "Failed to add to cart"
        );
      } else if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  return (
    <div className="products-page">
      <h1 className="products-title">
        {selectedCategory
          ? `${selectedCategory} Products`
          : "Fresh Groceries"}
      </h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map((product: Product) => (
            <div
              key={product._id}
              className="product-card"
            >
              <img
                src={
                  product.image ||
                  productImages[product.name.trim()]
                }
                alt={product.name}
                className="product-image"
              />

              <div className="product-content">
                <div className="product-name">
                  {product.name}
                </div>

                <div className="category-badge">
                  {categoryNames[product.category] ||
                    "Category"}
                </div>

                <div className="product-description">
                  {product.description}
                </div>

                <div className="price">
                  ${Number(product.price).toFixed(2)}
                </div>

                <div className="stock">
                  In Stock: {product.stock}
                </div>

                <button
                  className="add-btn"
                  onClick={() =>
                    addToCart(product._id)
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
