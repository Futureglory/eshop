'use client'
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
// import {useRouter} from "next/router"
const OtpVerification = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); // Get email from query params
  const [otp, setOtp] = useState(["", "", "", "", "",""]); 
    // Proper OTP state
  const [message, setMessage] = useState("");
  const [resendMessage, setResendMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState("");

  // Handle OTP input change
  const handleChange = (value, index) => {
    if (value.length > 1) return; // Prevent more than one character
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus(); // Move to next input
    }
  };

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    const fullOtp = otp.join(''); // Join OTP array into a string

    try {
      await axios.post('http://localhost:5000/api/users/otp', { email, otp: fullOtp });
      router.push("/login");
    } catch (error) {
      setError(error.response?.data.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

   // Handle OTP resend
   const handleResend = async () => {
    setResendMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/users/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResendMessage(response.ok ? '✅ OTP resent to your email.' : data.message || '❌ Could not resend OTP.');
    } catch (err) {
      setResendMessage('❌ Something went wrong. Try again.');
    }
  };


  return (
    <div className="otp-container">
      <h2>OTP Verification</h2>
      <p>Enter the 5-digit OTP sent to {email}.</p>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="otpInput">
        {otp.map((value, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            maxLength="1"
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            required
          />
        ))}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      <span className="otp-resend-text">Didn't receive the OTP?</span>
      <a  href="" 
      className="resend-btn"
       onClick={handleResend} disabled={!email}>
        Resend OTP
      </a>
      {message && <p className={message.includes("successfully") ? "success" : "error"}>{message}</p>}
      {resendMessage && <p className={resendMessage.includes('✅') ? 'success' : 'error'}>{resendMessage}</p>}
    </div>
  );
}

export default OtpVerification;
