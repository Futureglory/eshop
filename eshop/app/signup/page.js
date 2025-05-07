'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({ ...user, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};


    // Username validation
    if (user.username.trim().length < 3) {
      validationErrors.username = "Username must be at least 3 characters long.";
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      validationErrors.email = "Invalid email address.";
    }

    // Password validation
    if (user.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters long.";
    }

    // Confirm Password validation
    if (user.password !== user.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }
    if (!user.termsAccepted) {
      validationErrors.terms = "You must accept the Terms & Conditions.";
    }


    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError("");
    console.log("User created", user)
    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: user.password,
          termsAccepted: user.termsAccepted,
        }),
      });

      const data = await response.json();
      console.log("Response from backend:", data); // ✅ Add this line
      if (response.ok) {
        console.log("Routing to verify OTP...");
        router.push(`/otp?email=${encodeURIComponent(user.email)}`);      }
      else {
        setError({ server: data.message || "Signup failed." });
      }
    } catch (err) {
      setError({ server: "Something went wrong. Please try again." });
    }
  };


  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={user.username} onChange={handleChange} />
        {error.username && <p>{error.username}</p>}

        <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} />
        {error.email && <p>{error.email}</p>}

        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword((prev) => !prev)} className="toggle-icon">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {error.password && <p>{error.password}</p>}

        <div className="password-input">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={user.confirmPassword}
            onChange={handleChange}
          />
          <span onClick={() => setShowConfirmPassword((prev) => !prev)} className="toggle-icon">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {error.confirmPassword && <p>{error.confirmPassword}</p>}


        <label className="terms-label">
          <input
            type="checkbox"
            name="termsAccepted"
            onChange={handleChange}
            required
          />
          I accept the <a href="/terms">Terms & Conditions</a>.
        </label>
        {error.terms && <p className="error-message">{error.terms}</p>}

        <button type="submit">Register</button>
       
      </form>
      <p className="login-link">
          Already have an account? <Link href="/login">Login</Link>
        </p>
    </div>
  );
};

export default Signup;