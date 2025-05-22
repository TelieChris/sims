import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReportPage() {
  const [stockouts, setStockouts] = useState([]);
  const [filteredStockouts, setFilteredStockouts] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchStockouts();
  }, []);

  const fetchStockouts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/stockout');
      setStockouts(response.data);
      console.log("Stockouts fetched:", response.data); // Add this
      setFilteredStockouts(response.data);
    } catch (error) {
      console.error('Error fetching stockout data:', error);
    }
  };

  const filterByDate = () => {
    if (!startDate || !endDate) return;

    const filtered = stockouts.filter((item) => {
      const itemDate = new Date(item.stockout_date);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });

    setFilteredStockouts(filtered);
  };

  const getSummary = () => {
    const summary = {};

    filteredStockouts.forEach((item) => {
      const { spare_part_id, spare_part_name, stockout_quantity, stockout_total_price } = item;
      if (!summary[spare_part_id]) {
        summary[spare_part_id] = {
          spare_part_name,
          total_quantity: 0,
          total_value:"",
        };
      }

      summary[spare_part_id].total_quantity += stockout_quantity;
      summary[spare_part_id].total_value += stockout_total_price;
    });

    return Object.values(summary);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stock Out Reports</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={filterByDate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Filter
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">Summary by Spare Part</h3>
      <table className="w-full border border-collapse mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Spare Part</th>
            <th className="border p-2">Total Quantity</th>
            <th className="border p-2">Total Value (RWF)</th>
          </tr>
        </thead>
        <tbody>
          {getSummary().map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.spare_part_name}</td>
              <td className="border p-2">{item.total_quantity}</td>
              <td className="border p-2">{item.total_value.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mb-2">Detailed Transactions</h3>
      <table className="w-full border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Date</th>
            <th className="border p-2">Spare Part</th>
            <th className="border p-2">Quantity</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredStockouts.map((item) => (
            <tr key={item.stock_out_id}>
              <td className="border p-2">{item.stockout_date}</td>
              <td className="border p-2">{item.spare_part_name}</td>
              <td className="border p-2">{item.stockout_quantity}</td>
              <td className="border p-2">{item.stockout_unit_price}</td>
              <td className="border p-2">{item.stockout_total_price.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportPage;
