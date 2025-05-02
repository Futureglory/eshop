'use client';
import ProtectedRoute from '@/components/ProtectedRoute'; // adjust path if needed
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Unauthorized");

      const data = await response.json();
      setUser(data.user);
    } catch (err) {
      router.push("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!user) return <p className="loading-text">Loading...</p>;

  return (
    <ProtectedRoute>
      <div className="profile-container">
        <h2 className="profile-heading">Welcome, {user.username}!</h2>
        <p className="profile-email">Email: {user.email}</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
