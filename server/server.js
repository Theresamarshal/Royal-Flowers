require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const productRoutes = require("./routes/products");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "royal-flowers-secret-2025",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

// Auth middleware
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect("/admin-login");
}

// serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// serve static client files
app.use(express.static(path.join(__dirname, "../client")));

app.use("/api/products", productRoutes);

// Admin login page
app.get("/admin-login", (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect("/admin");
    }
    res.sendFile(path.join(__dirname, "../client/admin-login.html"));
});

// Admin login POST
app.post("/admin-login", (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USERNAME || "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "royalflowers2025";

    if (username === adminUser && password === adminPass) {
        req.session.isAdmin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

// Admin logout
app.get("/admin-logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin-login");
});

// Protected admin page
app.get("/admin", requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/admin.html"));
});

// Additional pages
app.get("/who-we-are", (req, res) => {
    res.sendFile(path.join(__dirname, "../who-we-are.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "../contact.html"));
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/flowershop")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.error("MongoDB Connection Error:", err));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Express Global Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});