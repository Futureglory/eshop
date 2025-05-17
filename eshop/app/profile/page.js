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
        const res = await fetch("http://localhost:5000/api/users/profile", {
          method: 'GET',
          credentials: 'include', // ✅ Important: sends HTTP-only cookies
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text(); // log unexpected HTML
          console.error("Expected JSON, got:", text);
          return;
        }

        if (res.status === 401) {
          console.error("User not authenticated. Please log in.");
          return router.push("/login");;
        }

        const data = await res.json();
        console.log("Profile data:", data);
        // Set state here with user info
      } catch (err) {
        console.error("Error fetching profile:", err);
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

  if (!user) {
    return <p>Loading profile...</p>; // Show loading or redirecting
  }

  return (
    <div className="profile-page">
      <h1 className="title2">Welcome, {user.username}!</h1>
      <img src={user.avatar || "/images/account.svg"} alt="Profile Avatar" className="avatar" />
      <p className="text" >Username: {user.username}</p>
      <p className="text">Email: {user.email}</p>
      <p className="text">Joined:
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
      <Link href="/edit"><FiSettings /> Edit Profile</Link>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );

};

export default Profile;