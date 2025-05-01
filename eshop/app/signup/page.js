'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
<link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet"/>

const Signup = () => {
  const router = useRouter();
  const [user, setUser] = useState({
     username: "", 
     email: "", 
     password: "",
      confirmPassword: ""
     });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: user.password,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Signup successful:", data);
        router.push("/otp");
      } else {
        setErrors({ server: data.message || "Signup failed." });
      }
    } catch (err) {
      setErrors({ server: "Something went wrong. Please try again." });
    }
  };
  

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={user.username} onChange={handleChange} />
        {errors.username && <p>{errors.username}</p>}

        <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} />
        {errors.email && <p>{errors.email}</p>}

        <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
        {errors.password && <p>{errors.password}</p>}

        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={user.confirmPassword} onChange={handleChange} />
        {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;