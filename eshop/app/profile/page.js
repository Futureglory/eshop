'use client'
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedRoute";
import { FiSettings, FiUser, FiMail, FiCalendar, FiEdit, FiLogOut } from "react-icons/fi";
import Link from 'next/link';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const router = useRouter();

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      setSessionLoading(true);
      setError("");
      
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        const userData = data.user || data;
        setUser(userData);
        setEditData({
          username: userData.username || '',
          email: userData.email || '',
        });
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to fetch profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Network error occurred");
    } finally {
      setSessionLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser.user || updatedUser);
        setIsEditing(false);
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Update failed");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        router.push("/login");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Logout failed");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed");
    }
  };

  // Loading state
  if (sessionLoading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button onClick={fetchProfile} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No user state
  if (!user) {
    return (
      <div className="profile-page">
        <div className="no-user-container">
          <p>No user data available</p>
          <Link href="/login">
            <button className="login-button">Go to Login</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="profile-page">
        <div className="profile-header">
          <h1>My Profile</h1>
          <div className="profile-actions">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="edit-toggle-btn"
            >
              {isEditing ? 'Cancel' : <><FiEdit /> Edit</>}
            </button>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-avatar">
            <img 
              src={user.avatar || "/images/default-avatar.png"} 
              alt="Profile Avatar" 
              className="avatar-image" 
            />
            {isEditing && (
              <button className="change-avatar-btn">
                Change Photo
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="edit-form">
              <div className="form-group">
                <label htmlFor="username">
                  <FiUser /> Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({...editData, username: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FiMail /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-item">
                <FiUser className="info-icon" />
                <div>
                  <label>Username</label>
                  <p>{user.username}</p>
                </div>
              </div>

              <div className="info-item">
                <FiMail className="info-icon" />
                <div>
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
              </div>

              {user.createdAt && (
                <div className="info-item">
                  <FiCalendar className="info-icon" />
                  <div>
                    <label>Member Since</label>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="profile-links">
            <Link href="/settings" className="profile-link">
              <FiSettings /> Account Settings
            </Link>
            <Link href="/orders" className="profile-link">
              Order History
            </Link>
            <Link href="/wishlist" className="profile-link">
              Wishlist
            </Link>
            <Link href="/addresses" className="profile-link">
              Manage Addresses
            </Link>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;