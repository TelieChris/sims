import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/login', { username, password }, { withCredentials: true });
      await checkAuth();
      navigate('/');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)}
          className="w-full mb-2 p-2 border" placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full mb-2 p-2 border" placeholder="Password" required />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
