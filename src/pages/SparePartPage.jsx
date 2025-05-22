import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SparePartPage() {
  const [spareParts, setSpareParts] = useState([]);
  const [formData, setFormData] = useState({
    spare_part_id: null,
    name: '',
    category: '',
    quantity: '',
    unit_price: '',
    total_price: ''
  });

  const isEditing = formData.spare_part_id !== null;

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/spareparts');
      setSpareParts(response.data);
    } catch (error) {
      toast.error('Failed to fetch spare parts.');
      console.error('Error fetching spare parts:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...formData,
      [name]: value
    };

    // Auto calculate total price
    if (name === 'quantity' || name === 'unit_price') {
      const quantity = name === 'quantity' ? value : updatedForm.quantity;
      const unitPrice = name === 'unit_price' ? value : updatedForm.unit_price;
      updatedForm.total_price = (parseFloat(quantity) * parseFloat(unitPrice) || 0).toFixed(2);
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/spareparts/${formData.spare_part_id}`, formData);
        toast.success('Spare part updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/spareparts', formData);
        toast.success('Spare part added successfully!');
      }

      setFormData({
        spare_part_id: null,
        name: '',
        category: '',
        quantity: '',
        unit_price: '',
        total_price: ''
      });
      fetchSpareParts();
    } catch (error) {
      toast.error('Failed to save spare part.');
      console.error('Error saving spare part:', error);
    }
  };

  const handleEdit = (part) => {
    setFormData({
      spare_part_id: part.spare_part_id,
      name: part.name,
      category: part.category,
      quantity: part.quantity,
      unit_price: part.unit_price,
      total_price: part.total_price
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this spare part?')) {
      try {
        await axios.delete(`http://localhost:5000/api/spareparts/${id}`);
        toast.success('Spare part deleted.');
        fetchSpareParts();
      } catch (error) {
        toast.error('Failed to delete spare part.');
        console.error('Error deleting spare part:', error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Spare Parts</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="p-2 border rounded" required />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="p-2 border rounded" required />
          <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} className="p-2 border rounded" required />
          <input type="number" step="0.01" name="unit_price" placeholder="Unit Price" value={formData.unit_price} onChange={handleChange} className="p-2 border rounded" required />
          <input type="number" step="0.01" name="total_price" placeholder="Total Price" value={formData.total_price} onChange={handleChange} className="p-2 border rounded" required readOnly />
        </div>
        <button type="submit" className={`mt-4 px-4 py-2 rounded text-white ${isEditing ? 'bg-yellow-600' : 'bg-blue-600'}`}>
          {isEditing ? 'Update Spare Part' : 'Add Spare Part'}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Total Price</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {spareParts.map((part) => (
            <tr key={part.spare_part_id}>
              <td className="border p-2">{part.name}</td>
              <td className="border p-2">{part.category}</td>
              <td className="border p-2">{part.quantity}</td>
              <td className="border p-2">{part.unit_price}</td>
              <td className="border p-2">{part.total_price}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(part)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(part.spare_part_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SparePartPage;
