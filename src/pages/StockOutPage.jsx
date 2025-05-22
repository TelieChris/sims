import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StockOutPage() {
  const [spareParts, setSpareParts] = useState([]);
  const [stockOutRecords, setStockOutRecords] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    spare_part_id: '',
    stockout_quantity: '',
    stockout_unit_price: '',
    stockout_total_price: '',
    stockout_date: ''
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, stockout_date: today }));
    fetchSpareParts();
    fetchStockOutRecords();
  }, []);

  const fetchSpareParts = async () => {
    try {
      // Ensure your backend returns spare parts with a unit_price field
      const response = await axios.get('http://localhost:5000/api/spareparts');
      setSpareParts(response.data);
    } catch (error) {
      toast.error('Failed to fetch spare parts.');
    }
  };

  const fetchStockOutRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stockout');
      setStockOutRecords(response.data);
    } catch (error) {
      toast.error('Failed to fetch stock-out records.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    // If quantity changes, recalc total price
    if (name === 'stockout_quantity') {
      const quantity = parseFloat(value) || 0;
      const unitPrice = parseFloat(formData.stockout_unit_price) || 0;
      updatedForm.stockout_total_price = (quantity * unitPrice).toFixed(2);
    }

    setFormData(updatedForm);
  };

  // When spare part changes, update unit price automatically
  const handleSparePartChange = (e) => {
    const selectedId = e.target.value;
    const selectedPart = spareParts.find(part => part.spare_part_id === parseInt(selectedId));
    if (selectedPart) {
      const unitPrice = parseFloat(selectedPart.unit_price || 0);
      const quantity = parseFloat(formData.stockout_quantity) || 0;
      setFormData({
        ...formData,
        spare_part_id: selectedId,
        stockout_unit_price: unitPrice.toFixed(2),
        stockout_total_price: (quantity * unitPrice).toFixed(2)
      });
    } else {
      // Reset if no spare part selected
      setFormData({
        ...formData,
        spare_part_id: '',
        stockout_unit_price: '',
        stockout_total_price: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/stockout/${editingId}`, formData);
        toast.success('Stock-out updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/stockout', formData);
        toast.success('Stock-out recorded successfully!');
      }

      resetForm();
      fetchStockOutRecords();
    } catch (error) {
      toast.error('Failed to submit stock out.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/stockout/${id}`);
      toast.success('Stock-out record deleted.');
      fetchStockOutRecords();
    } catch (error) {
      toast.error('Failed to delete record.');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.stock_out_id);
    setFormData({
      spare_part_id: record.spare_part_id,
      stockout_quantity: record.stockout_quantity,
      stockout_unit_price: parseFloat(record.stockout_unit_price).toFixed(2),
      stockout_total_price: parseFloat(record.stockout_total_price).toFixed(2),
      stockout_date: record.stockout_date
    });
  };

  const resetForm = () => {
    setFormData({
      spare_part_id: '',
      stockout_quantity: '',
      stockout_unit_price: '',
      stockout_total_price: '',
      stockout_date: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stock Out</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="spare_part_id"
            value={formData.spare_part_id}
            onChange={handleSparePartChange}
            className="p-2 border rounded"
            required
          >
            <option value="">Select Spare Part</option>
            {spareParts.map((part) => (
              <option key={part.spare_part_id} value={part.spare_part_id}>
                {part.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="stockout_quantity"
            placeholder="Quantity"
            value={formData.stockout_quantity}
            onChange={handleChange}
            className="p-2 border rounded"
            min="1"
            required
          />

          <input
            type="text"
            name="stockout_unit_price"
            placeholder="Unit Price"
            value={formData.stockout_unit_price}
            readOnly
            className="p-2 border rounded bg-gray-100"
          />

          <input
            type="text"
            name="stockout_total_price"
            placeholder="Total Price"
            value={formData.stockout_total_price}
            readOnly
            className="p-2 border rounded bg-gray-100"
          />

          <input
            type="date"
            name="stockout_date"
            value={formData.stockout_date}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="mt-4">
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
            {editingId ? 'Update Stock Out' : 'Submit Stock Out'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-4 bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <h3 className="text-xl font-semibold mb-2">Recent Stock-Out Records</h3>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Spare Part</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit Price</th>
              <th className="border p-2">Total Price</th>
              <th className="border p-2">Date</th>
              {/* <th className="border p-2">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {stockOutRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No stock-out records found.
                </td>
              </tr>
            ) : (
              stockOutRecords.map((record) => (
                <tr key={record.stock_out_id}>
                  <td className="border p-2">{record.stock_out_id}</td>
                  <td className="border p-2">{record.spare_part_name}</td>
                  <td className="border p-2">{record.stockout_quantity}</td>
                  <td className="border p-2">{parseFloat(record.stockout_unit_price).toFixed(2)}</td>
                  <td className="border p-2">{parseFloat(record.stockout_total_price).toFixed(2)}</td>
                  <td className="border p-2">{record.stockout_date}</td>
                  {/* <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.stock_out_id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockOutPage;
