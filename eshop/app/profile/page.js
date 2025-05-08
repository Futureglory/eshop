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


  // const fetchProfile = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/users/profile", {
  //     method: POST,
  //       credentials: "include",
  //     });
  
  //     const data = await response.json();
  //     if (response.ok) setUser(data.user);
  //     else setError("Failed to load profile.");
  //   } catch (err) {
  //     setError("Something went wrong.");
  //   }
  // };

 
  const handleLogout = async () => {
    try {

      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
credentials: "include",
      });

      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    
    <div>
    <h1>Welcome, {user.username}!</h1>
    <p>Email: {user.email}</p>
    <p>Joined: {user.createdAt}</p>
  </div>

    
  );
};

export default Profile;