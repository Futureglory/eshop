'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    rememberDevice: false // Changed from "" to false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const { email, password, rememberDevice } = credentials;

      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, 
          password, 
          rememberDevice
        }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        console.log("Login successful:", data);
        // Use Next.js router instead of window.location
        router.push("/");
      } else {
        console.error("Login failed:", data.message);
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Memoized function to prevent recreation on every render
  const checkSessionExpiration = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        // Session expired - clear any existing cookies and redirect
        document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        alert("Session expired. Please log in again.");
        router.push("/login");
      } else if (response.ok) {
        const userData = await response.json();
        // If user is already logged in, redirect to home
        if (userData && userData.id) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
      // Don't show error to user for background session checks
    }
  }, [router]);

  // ✅ Check session only once when component mounts
  useEffect(() => {
    checkSessionExpiration();
  }, [checkSessionExpiration]);

  // ✅ Set up session check interval (only if needed)
  useEffect(() => {
    // Only set up interval if user is not on login page actively
    const interval = setInterval(() => {
      checkSessionExpiration();
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [checkSessionExpiration]);

  return (
    <div className="login-container">
      <h1>Login</h1>
      {user?.isVerified ? (
        <h2>Welcome, {user?.username}!</h2>
      ) : (
        <h2>Welcome!</h2>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          disabled={loading}
        />
        
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
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
              checked={credentials.rememberDevice}
              onChange={(e) =>
                setCredentials({ ...credentials, rememberDevice: e.target.checked })
              }
              disabled={loading}
            />
            Remember Me
          </label>
          <p className="forgot-password">
            <Link href="/forgot-password">Forgot password?</Link>
          </p>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      
      <p className="signup-link">
        Don't have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;