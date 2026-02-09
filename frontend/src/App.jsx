import { useEffect, useState } from "react";
import { productService } from "../services/productService";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    price: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (formData.quantity < 0) {
      setError("Quantity cannot be negative");
      return;
    }
    if (formData.price < 0) {
      setError("Price cannot be negative");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        await productService.updateProduct(editingId, formData);
      } else {
        await productService.createProduct(formData);
      }

      setFormData({ name: "", quantity: 0, price: 0 });
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(
        editingId
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product) {
    setFormData({
      name: product.name,
      quantity: product.quantity,
      price: product.price
    });
    setEditingId(product.id);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await productService.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({ name: "", quantity: 0, price: 0 });
    setError(null);
  }

  // Filter and sort products
  const filteredProducts = products
    .filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "quantity") return b.quantity - a.quantity;
      if (sortBy === "price") return b.price - a.price;
      return 0;
    });

  const totalValue = products.reduce(
    (sum, p) => sum + p.quantity * p.price,
    0
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>
          <span className="icon">📦</span>
          Product Inventory
        </h1>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-label">Total Products</span>
            <span className="stat-value">{products.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Inventory Value</span>
            <span className="stat-value">₹{totalValue.toFixed(2)}</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="error">
          <span className="error-icon">⚠️</span>
          {error}
          <button
            className="error-close"
            onClick={() => setError(null)}
            aria-label="Close error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="product-form">
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                id="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: Number(e.target.value)
                  })
                }
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input
                id="price"
                type="number"
                step="0.01"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? (
                <span className="loading-spinner">⏳</span>
              ) : editingId ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="products-list">
        <div className="list-header">
          <h2>Product List</h2>
          <div className="list-controls">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sort-box">
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="quantity">Quantity</option>
                <option value="price">Price</option>
              </select>
            </div>
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="loading">
            <div className="loading-spinner-large">⏳</div>
            <p>Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <h3>No products found</h3>
            <p>
              {searchTerm
                ? "Try adjusting your search"
                : "Add your first product to get started"}
            </p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className={editingId === p.id ? "editing" : ""}
                >
                  <td className="product-name">{p.name}</td>
                  <td>
                    <span className="badge">{p.quantity}</span>
                  </td>
                  <td className="price">${p.price.toFixed(2)}</td>
                  <td className="total-value">
                    ${(p.quantity * p.price).toFixed(2)}
                  </td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(p)}
                      disabled={loading}
                      title="Edit product"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(p.id)}
                      disabled={loading}
                      title="Delete product"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;