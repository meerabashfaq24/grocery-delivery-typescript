import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-left">

          <span className="tag">Fresh Groceries Delivered</span>

          <h1>
            Fresh Food <br /> Delivered To <br /> Your Doorstep
          </h1>

          <p>
            Shop fresh fruits, vegetables, dairy products and daily essentials
            at affordable prices with quick delivery.
          </p>

          <div className="hero-buttons">
            <Link
              to={token ? "/products" : "/login"}
              className="primary-btn"
            >
              Shop Now
            </Link>

            <Link
              to="/products"
              className="secondary-btn"
            >
              Browse Products
            </Link>
          </div>

        </div>

        <div className="hero-right">

          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900"
            alt="Groceries"
          />

        </div>

      </section>

      {/* CATEGORIES */}

      <section className="categories">

        <h2>Shop by Category</h2>

        <div className="category-grid">

          <Link className="category-card" to="/products?category=Fruits">
  🍎
  <h3>Fruits</h3>
</Link>

<Link className="category-card" to="/products?category=Vegetables">
  🥦
  <h3>Vegetables</h3>
</Link>

<Link className="category-card" to="/products?category=Dairy">
  🥛
  <h3>Dairy</h3>
</Link>

<Link className="category-card" to="/products?category=Bakery">
  🍞
  <h3>Bakery</h3>
</Link>

<Link className="category-card" to="/products?category=Meat">
  🍗
  <h3>Meat</h3>
</Link>

<Link className="category-card" to="/products?category=Grocery">
  🍚
  <h3>Grocery</h3>
</Link>
 </div>

      </section>
    </>
  );
}

