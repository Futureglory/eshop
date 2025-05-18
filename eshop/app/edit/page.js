"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    avatar: ""
  });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/users/profile", { credentials: "include" })
      .then((response) => response.json())
      .then((data) =>
        setUser({
          username: data.username || "",
          email: data.email || "",
          avatar: data.avatar || ""
        })
      )
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setUser({ ...user, avatar: URL.createObjectURL(file) }); // Preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    if (profileImage) formData.append("avatar", profileImage);

    try {
      const response = await fetch("http://localhost:5000/api/users/profile/update", {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
        router.push("/profile");
      } else {
        setError(data.message || "Failed to update profile.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="edit-profile-container">
      <h1 className="edit-profile-title">Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {user.avatar && (
          <div className="avatar-preview-container">
            <p>Image Preview:</p>
            <img src={user.avatar} alt="Profile Preview" className="avatar-preview" />
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="submit-button">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
