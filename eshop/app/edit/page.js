"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const [user, setUser] = useState({ username: "", email: "", avatar: "" });
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/users/profile", { credentials: "include" })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  if (!user) return <p>Please log in to edit your profile.</p>;

   
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setUser({ ...user, avatar: URL.createObjectURL(file) }); // Show preview
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
        setError("Failed to update profile.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

 return (
    <div className="edit-profile">
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />

        <label>Email:</label>
        <input type="email" name="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />

        <label>Profile Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {user.avatar && <img src={user.avatar} alt="Profile Preview" className="avatar-preview" />}

        {error && <p className="error">{error}</p>}

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );

};

export default EditProfile;