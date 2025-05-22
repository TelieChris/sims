import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function Sidebar() {
  const navigate = useNavigate();
  
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <ul>
        <li className="mb-2">
            <Link to="/" className="block p-2 hover:bg-gray-700 rounded">Home</Link>
          </li>
          <li className="mb-2">
            <Link to="/sparepart" className="block p-2 hover:bg-gray-700 rounded">Spare Parts</Link>
          </li>
          <li className="mb-2">
            <Link to="/stockin" className="block p-2 hover:bg-gray-700 rounded">Stock In</Link>
          </li>
          <li className="mb-2">
            <Link to="/stockout" className="block p-2 hover:bg-gray-700 rounded">Stock Out</Link>
          </li>
          <li className="mb-2">
            <Link to="/report" className="block p-2 hover:bg-gray-700 rounded">Report</Link>
          </li>
        </ul>
      </div>

      <div className="pt-4 border-t border-gray-700">
          <div className="text-sm">
            <p className="mb-2">Logged in as: <strong></strong></p>
            <button
              onClick={logout}
              className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        
          <Link to="/login" className="underline">
            Login
          </Link>

      </div>
    </aside>
  );
}

export default Sidebar;
