'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedRoute";

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "", profileImage: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch user profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/profile", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) setUser(data.user);
      else setError("Failed to load profile.");
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  // Handle profile image selection
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  // Update user profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        alert("Profile updated successfully!");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Profile update failed.");
    }
  };

  // Logout function (Clears token cookie)
  const handleLogout = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <ProtectedRoute>
          <div className="profile-container">
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      
      {user.profileImage && <img src={user.profileImage} alt="Profile" className="profile-image" />}

      <form onSubmit={handleUpdate}>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
          required
        />
        <input type="file" name="profileImage" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Update Profile</button>
      </form>

      <button onClick={handleLogout} className="logout-button">Logout</button>
      {error && <p className="error-message">{error}</p>}
    </div>
    </ProtectedRoute>
  );
};

export default Profile;