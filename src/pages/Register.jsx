import { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

export default function Register() {
  const [inputs, setInputs] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', inputs, {
        withCredentials: true
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold text-center">Register</h2>
        <input type="text" name="username" placeholder="Username"
               className="w-full p-2 border rounded" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password"
               className="w-full p-2 border rounded" onChange={handleChange} required />
        <button className="w-full bg-green-500 text-white py-2 rounded">Register</button>
        <p className="text-center text-green-600">{message}</p>
      </form>
    </div>
  );
}
