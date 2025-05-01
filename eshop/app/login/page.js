'use client'
import { useEffect, useState } from "react";

const Login = () => {
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
  
    const data = await response.json();
  
    if (data.token) {
      fetchProfile(); // Retrieve user data after login
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();
      setUser(data.user);
    };

    fetchProfile();
  }, []);

  return user ? <h2>Welcome, {user.username}!</h2> : <p>Loading...</p>;
};

export default Login;