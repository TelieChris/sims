import { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function useAuth() {
  const [auth, setAuth] = useState({ loading: true, loggedIn: false, user: null });

  useEffect(() => {
    axios.get('http://localhost:4000/api/auth/session')
      .then(res => {
        setAuth({ loading: false, loggedIn: res.data.loggedIn, user: res.data.user });
      })
      .catch(() => {
        setAuth({ loading: false, loggedIn: false, user: null });
      });
  }, []);

  return auth;
}
