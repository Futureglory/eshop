'use client'
import { useState } from "react";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace with your backend OTP verification endpoint
      const response = await fetch("http://localhost:5000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP verified successfully!");
        // Redirect or show success screen
      } else {
        setMessage(data.message || "Invalid OTP.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <h2>Verify Your Email</h2>
      <p>Enter the OTP sent to your email address.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={handleChange}
        />
        <button type="submit">Verify OTP</button>
      </form>
      {message && <p className={message.includes("successfully") ? "success" : "error"}>{message}</p>}
    </div>
  );
};

export default OtpVerification;
