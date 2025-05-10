import { useState, useEffect } from "react";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", avatar: "", password: "" });

  useEffect(() => {
    fetch("http://localhost:5000/api/users/account", { credentials: "include" })
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setFormData({ name: data.name, email: data.email, avatar: data.avatar, password: "" });
      })
      .catch(() => setUser(null));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const data = await response.json();
    alert(data.message);
  };

  if (!user) return <p>Please log in to update your settings.</p>;

  return (
    <div>
      <h1>Account Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>Avatar URL:</label>
        <input type="text" name="avatar" value={formData.avatar} onChange={handleChange} />

        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />

        <button type="submit">Update Settings</button>
      </form>
    </div>
  );
};

export default Settings;