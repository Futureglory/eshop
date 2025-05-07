const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
const cookieParser = require('cookie-parser');
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // explicitly specify your frontend origin
  credentials: true // allow cookies or authorization headers
}));

app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies

// Routes
app.use("/api/users", userRoutes);

app.use('/api/auth', authRoutes);



// Sync Database & Start Server
sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error: ", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Handle Unexpected Errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception: ", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection: ", reason);
});