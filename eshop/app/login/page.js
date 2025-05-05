'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react"; // 👈 Add this
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // Initialize user state to null
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (response.ok) {
        document.cookie = `token=${data.token};path=/;`;
        fetchProfile();
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Login failed. Try again.");
    }
  };


  const fetchProfile = async () => {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    if (!token) {
      console.warn("No token found, skipping profile fetch.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        console.warn("Error fetching profile:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };


  return (
    <div className="login-container">
      <h1>Login</h1>
      {user?.isVerified ? (
        <h2>Welcome, {user.username}!</h2>
      ) : (
        <h2>Welcome!</h2>
      )}
      {/* <p> login to continue.</p> */}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
          />
          <span onClick={togglePassword} className="eye-icon">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <div className="remember-container">
        <label className="remember-label">
    <input
      type="checkbox"
      name="remember"
      checked={credentials.remember || false}
      onChange={(e) =>
        setCredentials({ ...credentials, remember: e.target.checked })
      }
    />
    Remember Me
  </label>
        <p className="forgot-password">
          <Link href="/forgot-password">Forgot password?</Link>
        </p>
</div>
        <button type="submit">Login</button>

      </form>

      {error && <p className="error-message">{error}</p>}
      <p className="signup-link">Don't have an account? <Link href="/signup">Sign Up</Link></p>

    </div>

  );
};

export default Login;
