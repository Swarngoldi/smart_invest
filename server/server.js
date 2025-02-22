const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // Allows cookies to be sent from frontend
}));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/smart_invest", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// ✅ Signup Route
app.post("/signup", async (req, res) => {
  const { name, phone, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Save new user
  const newUser = new User({ name, phone, email, password: hashedPassword });
  await newUser.save();

  res.json({ message: "Signup successful!" });
});

// ✅ Login Route (Using HTTP-Only Cookie for JWT)
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, "your_secret_key", { expiresIn: "1h" });

        // Store JWT in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,  // Prevents JavaScript access
            secure: true,    // Send only over HTTPS (set to false for local dev)
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        res.json({ message: "Login successful!" });

    } catch (err) {
        console.error("Error in Login:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Middleware to Protect Routes
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token, "your_secret_key");
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

// ✅ Protected Route Example (Home Page)
app.get("/home", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to Smart Invest!" });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
  res.json({ message: "Logged out successfully!" });
});


const fetch = require("node-fetch");
const csv = require("csv-parser");
const { Readable } = require("stream");

app.get("/stocks", async (req, res) => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/smeet7913/SmartInvest-Basket/main/Midcap.csv");
    if (!response.ok) throw new Error("Failed to fetch CSV");

    const results = [];
    const readableStream = new Readable();
    readableStream.push(await response.text());
    readableStream.push(null);

    readableStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => res.json(results));
  } catch (err) {
    console.error("Error fetching CSV:", err);
    res.status(500).json({ message: "Error fetching CSV file" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
