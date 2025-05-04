'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

const VerifyReset = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ email: "", token: "", newPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Reset failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="verify-reset-container">
      <h2>Enter Your Reset Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="token"
          placeholder="Reset Code"
          value={credentials.token}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={credentials.newPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default VerifyReset;