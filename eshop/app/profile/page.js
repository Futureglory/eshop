'use client'
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../components/protectedRoute";
import { FiSettings } from "react-icons/fi";
import Link from 'next/link';

const Profile = () => {
  const [user, setUser] = useState({ username: "", email: "", avatar: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  // Fetch user profile
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("jwt="))?.split("=")[1];

      if (!token) {
        console.error("No authentication token found! Please log in.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
      } else {
        console.error("Error fetching profile:", data.message);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  fetchProfile();
}, []);

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
      <h1 className="title2">Welcome, {user.username}!</h1>
      <img src={user.avatar || "/images/account.svg"} alt="Profile Avatar" className="avatar" />
          <p className="text" >Username: {user.username}</p>
      <p className="text">Email: {user.email}</p>
      <p className="text">Joined:
        {/* {new Date  */}
        {(user.createdAt)}
        {/* .toLocaleDateString()} */}
        </p>
                    <Link href="/edit"><FiSettings /> Edit Profile</Link>
      <button className="logout-btn">Logout</button>
    </div>
  );

};

export default Profile;