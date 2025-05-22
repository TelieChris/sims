import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SparePartPage from './pages/SparePartPage';
import StockInPage from './pages/StockInPage';
import StockOutPage from './pages/StockOutPage';
import ReportPage from './pages/ReportPage';
import LogoutPage from './pages/LogoutPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import { ToastContainer } from 'react-toastify';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import ProtectedRoute from './pages/ProtectedRoute';
import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000';

function App() {

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path="/sparepart" element={<SparePartPage />} />
            <Route path="/stockin" element={<StockInPage />} />
            <Route path="/stockout" element={<StockOutPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
          <ToastContainer position="top-right" />
        </div>
      </div>
    </Router>
  );
}

export default App;
