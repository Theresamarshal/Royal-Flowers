require("dotenv").config();
const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const path = require("path");



const productRoutes = require("./routes/products");



const app = express();



app.use(cors());

app.use(express.json());

app.use(express.urlencoded({extended:true}));



// serve uploaded images

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));



// serve static client files

app.use(express.static(path.join(__dirname, "../client")));



app.use("/api/products", productRoutes);



// serve additional HTML pages

app.get("/who-we-are", (req, res) => {

    res.sendFile(path.join(__dirname, "../who-we-are.html"));

});



app.get("/contact", (req, res) => {

    res.sendFile(path.join(__dirname, "../contact.html"));

});



app.get("/admin", (req, res) => {

    res.sendFile(path.join(__dirname, "../client/admin.html"));

});



app.get("/test", (req, res) => {

    res.sendFile(path.join(__dirname, "../../test.html"));

});



app.get("/main-test", (req, res) => {

    res.sendFile(path.join(__dirname, "../../main-test.html"));

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