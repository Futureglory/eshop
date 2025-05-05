'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const togglePassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (newPassword.length < 8) {
      return setError("Password must be at least 8 characters.");
    }

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Password reset successful. Redirecting to login...");
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setError(data.message || "Password reset failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (!email || !token) {
      setError("Invalid or expired reset link.");
    }
  }, [email, token]);

  return (
    <div className="reset-password-container">
      <div className="reset-box">
        <h2>Set New Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="password-wrapper">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span onClick={togglePassword} className="eye-icon">
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span onClick={toggleConfirm} className="eye-icon">
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit">Reset Password</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

       
      </div>
    </div>
  );
};

export default ResetPassword;
