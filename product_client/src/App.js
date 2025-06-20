import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://ec2-108-129-11-224.eu-west-1.compute.amazonaws.com:3000/products";

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

  const handlePriceChange = (e) => {
    let rawValue = e.target.value.replace(/[^\d.-]/g, "");
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      price: rawValue,
    }));
  };

  const handlePriceBlur = () => {
    const price = parseFloat(newProduct.price);
    if (!isNaN(price)) {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        price: price.toFixed(2),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (isNaN(newProduct.price) || newProduct.price <= 0) {
      setErrorMessage("Price cannot be negative.");
      return;
    }

    if (editingId) {
      try {
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        });
        if (response.ok) {
          setEditingId(null); 
          setNewProduct({ name: "", description: "", price: "", available: true });
          fetchProducts();
        } else {
          setErrorMessage("Failed to update product, please try again.");
        }
      } catch (error) {
        setErrorMessage("Error updating product, please try again.");
        console.error("Error updating product:", error);
      }
    } else {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProduct),
        });
        if (response.ok) {
          setNewProduct({ name: "", description: "", price: "", available: true });
          fetchProducts();
        } else {
          setErrorMessage("Failed to add product, please try again.");
        }
      } catch (error) {
        setErrorMessage("Error adding product, please try again.");
        console.error("Error creating product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      available: product.available,
    });
    setEditingId(product.id); 
  };

  const handleDelete = async (id) => {
    setErrorMessage(""); 
    if (window.confirm("This product will now be deleted!")) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchProducts();
        } else {
          setErrorMessage("Failed to delete product, please try again.");
        }
      } catch (error) {
        setErrorMessage("Error deleting product. Please try again later.");
        console.error("Error deleting product:", error);
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  return (
    <div className="App">
      <header>
        <h1>James' Products</h1>
      </header>

      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <div className="product-list">
                <div>
                  <strong>{product.name}</strong> - {formatPrice(product.price)}
                  {product.available ? " (Available)" : " (Unavailable)"}
                </div>
                <div className="buttom-functions">
                  <button className="edit-button" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(product.id)}>Delete</button>
                </div>
              </div>
              <div>{product.description}</div>
              <br />
            </li>
          ))}
        </ul>
      ) : (
        <h3>No products listed !</h3>
      )}

      <br /><br />
      <div className="formclass">
        <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
        {errorMessage && <div className="error-message">{errorMessage}<br /></div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          /><br />
          <textarea
            name="description"
            placeholder="Description"
            value={newProduct.description}
            onChange={handleInputChange}
            required
          /><br />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            required
          /><br />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 35%', width: '50%' }}>
            <label htmlFor="available">Available</label>
            <input
              type="checkbox"
              name="available"
              checked={newProduct.available}
              onChange={handleInputChange}
            />
          </div>
          <button className="add-button" type="submit">{editingId ? "Update Product" : "Add Product"}</button>
          {editingId && <button className="cancel-button" type="button" onClick={() => {
            setEditingId(null);
            setNewProduct({ name: "", description: "", price: "", available: true });
          }}>Cancel</button>}
        </form>
      </div>
    </div>
  );
}

export default App;
