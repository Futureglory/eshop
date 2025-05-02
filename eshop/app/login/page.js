'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState({email:"", password:""});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try{
    const response = await axios.post("http://localhost:5000/api/users/login",user);
    localStorage.setItem("token", response.data.token); // Save token
    fetchProfile(); // Fetch user after login
    router.push("/"); // Redirect to home page after login
    } catch (error) {
      setError("Invalid email or password.");
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setUser(data.user);
  };


  return (
    <div>
      {user ? (
        <h2>Welcome, {user.username}!</h2>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          <input
            type="password"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit" onClick={handleLogin}>Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
