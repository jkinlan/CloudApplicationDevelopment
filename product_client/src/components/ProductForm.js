import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../api';

function ProductForm({ currentProduct, onSave }) {
  const [formData, setFormData] = useState({ name: '', price: '', description: '', available: true });

  useEffect(() => {
    if (currentProduct) setFormData(currentProduct);
  }, [currentProduct]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.id) {
      await updateProduct(formData.id, formData);
    } else {
      await createProduct(formData);
    }
    onSave(); // callback to refresh list
    setFormData({ name: '', price: '', description: '', available: true });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
      <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" required type="number" />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
      <label>
        <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
        Available
      </label>
      <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
    </form>
  );
}

export default ProductForm;