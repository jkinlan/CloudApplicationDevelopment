import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
  });

  const API_URL = "http://localhost:3000/products"; 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        setNewProduct({ name: "", description: "", price: "", available: true }); // Reset
        fetchProducts(); // Refresh list
      } else {
        console.error("Failed to create product");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="App">
      <h1>James' Products</h1>

      {/* List of Products */}
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <strong>{product.name}</strong> - ${product.price}
              {product.available ? " (Available)" : " (Unavailable)"}<br></br>
              {product.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found.</p>
      )}

      {/* New Product Form */}
      <br></br><h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newProduct.name}
          onChange={handleInputChange}
          required
        /><br/>
        <textarea
          name="description"
          placeholder="Description"
          value={newProduct.description}
          onChange={handleInputChange}
          required
        /><br/>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleInputChange}
          required
        /><br/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 35%', width: '50%'}}>
        <label htmlFor="available">Available</label>
          <input
              type="checkbox"
              name="available"
              checked={newProduct.available}
              onChange={handleInputChange}
          />

</div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default App;
