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
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberDevice: ""
  });
  const [showPassword, setShowPassword] = useState(false);


  // useEffect(() => {
  //   fetchProfile();
  // }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, rememberDevice } = credentials;

    const response = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, password, rememberDevice
      }),
    });
    const data = await response.json();
  console.log("Login Response:", data);

    if (response.ok) {
      console.log("Login successful:", data);
      window.location.href = "/"; // ✅ Redirects to home page
    } else {
      console.error("Login failed:", data.message);
    }
  };

  const checkSessionExpiration = async () => {
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();

    if (response.status === 401) {
      alert("Session expired. Please log in again.");
      document.cookie = `jwt=${token}; path=/; max-age=${24 * 60 * 60};`;
      window.location.href = "/login"; // Redirect to login page
    }
  };

  // Check session every 10 minutes
  useEffect(() => {
    const interval = setInterval(checkSessionExpiration, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="login-container">
      <h1>Login</h1>
      {user?.isVerified ? (
        <h2>Welcome, {user?.username}!</h2>
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
              name="rememberDevice"
              checked={credentials.rememberDevice || false}
              onChange={(e) =>
                setCredentials({ ...credentials, rememberDevice: e.target.checked })
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
