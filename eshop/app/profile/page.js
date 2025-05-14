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
    fetch("http://localhost:5000/api/users/profile", { credentials: "include" })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>Please log in to view your profile.</p>;


  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "POST",
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) setUser(data.user);
      else setError("Failed to load profile.");
    } catch (err) {
      setError("Something went wrong.");
    }
  };

const handleLogout = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/users/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      setUser(null); // Clear user session
      router.push("/login"); // Redirect user after logout
    }
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

 
  return (
    <div className="profile-page">
      <h1>Welcome, {user.name}!</h1>
      <img src={user.avatar} alt="Profile Avatar" className="avatar" />
      <p>Email: {user.email}</p>
      <p>Joined: {user.createdAt}</p>
      <button className="logout-btn">Logout</button>
    </div>
  );

};

export default Profile;