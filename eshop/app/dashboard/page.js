'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(data);
      } catch (err) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h1>User Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default Dashboard;
