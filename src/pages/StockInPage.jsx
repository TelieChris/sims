import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StockInPage() {
  const [spareParts, setSpareParts] = useState([]);
  const [stockInRecords, setStockInRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    spare_part_id: '',
    stockin_quantity: '',
    stockin_date: ''
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData((prev) => ({ ...prev, stockin_date: today }));
    fetchSpareParts();
    fetchStockInRecords();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/spareparts');
      setSpareParts(response.data);
    } catch (error) {
      toast.error('Failed to fetch spare parts.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockInRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stockin');
      setStockInRecords(response.data);
    } catch (error) {
      toast.error('Failed to fetch stock-in records.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.spare_part_id || !formData.stockin_quantity || !formData.stockin_date) {
      toast.warning('Please fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        // Update mode
        await axios.put(`http://localhost:5000/api/stockin/${editingId}`, formData);
        toast.success('Stock-in updated successfully!');
      } else {
        // Create mode
        await axios.post('http://localhost:5000/api/stockin', formData);
        toast.success('Stock-in recorded successfully!');
      }

      setFormData({
        spare_part_id: '',
        stockin_quantity: '',
        stockin_date: new Date().toISOString().split('T')[0]
      });
      setEditingId(null);
      fetchStockInRecords();
    } catch (error) {
      toast.error('Failed to submit stock-in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/stockin/${id}`);
      toast.success('Stock-in deleted.');
      fetchStockInRecords();
    } catch (error) {
      toast.error('Failed to delete record.');
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.stockin_id);
    setFormData({
      spare_part_id: record.spare_part_id,
      stockin_quantity: record.stockin_quantity,
      stockin_date: record.stockin_date
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stock In</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="spare_part_id"
            value={formData.spare_part_id}
            onChange={handleChange}
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
            name="stockin_quantity"
            placeholder="Quantity"
            value={formData.stockin_quantity}
            onChange={handleChange}
            className="p-2 border rounded"
            min="1"
            required
          />

          <input
            type="date"
            name="stockin_date"
            value={formData.stockin_date}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`mt-4 px-4 py-2 rounded text-white ${
            submitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {editingId ? 'Update Stock In' : 'Submit Stock In'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setFormData({
                spare_part_id: '',
                stockin_quantity: '',
                stockin_date: new Date().toISOString().split('T')[0]
              });
              setEditingId(null);
            }}
            className="ml-4 mt-4 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3 className="text-xl font-semibold mb-2">Recent Stock-In Records</h3>
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Spare Part</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Date</th>
              {/* <th className="border p-2">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {stockInRecords.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No stock-in records available.
                </td>
              </tr>
            ) : (
              stockInRecords.map((record) => (
                <tr key={record.stock_in_id}>
                  <td className="border p-2">{record.stock_in_id}</td>
                  <td className="border p-2">{record.name}</td>
                  <td className="border p-2">{record.stockin_quantity}</td>
                  <td className="border p-2">{record.stockin_date}</td>
                  {/* <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record.stockin_id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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

export default StockInPage;
