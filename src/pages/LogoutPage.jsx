import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post('http://localhost:5000/api/logout', {}, {
          withCredentials: true, // Important: sends cookies
        });
      } catch (error) {
        console.error('Logout failed', error);
      } finally {
        navigate('/'); // Redirect after logout (success or failure)
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="p-4">
      <p className="text-lg">Logging out...</p>
    </div>
  );
}

export default LogoutPage;
