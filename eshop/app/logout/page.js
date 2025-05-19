const handleLogout = async () => {
  const response = await fetch("http://localhost:5000/api/users/logout", {
    method: "POST",
    credentials: "include", // ✅ Ensures cookies are cleared
  });

  const data = await response.json();
  
  if (response.ok) {
    alert(data.message);
    window.location.href = "/login"; // ✅ Redirect to login page
  } else {
    console.error("Logout failed:", data.message);
  }
};

// Add this button in your UI
<button onClick={handleLogout}>Logout</button>