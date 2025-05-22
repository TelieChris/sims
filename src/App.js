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
import { AuthContext } from './context/AuthContext';
import HomePage from './pages/HomePage';

function App() {
  const isAuthenticated = localStorage.getItem('isLoggedIn');
  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
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
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
          <ToastContainer position="top-right" />
        </div>
      </div>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
