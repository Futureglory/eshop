'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push(`/verify-reset?email=${encodeURIComponent(email)}`);
      } else {
        setError(data.message || "Reset request failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-box">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Request Reset</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
    </div>
  );
};

export default ResetPassword;