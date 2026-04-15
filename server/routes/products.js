const express = require("express");
const router = express.Router();
const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Explicitly configure Cloudinary with individual env vars
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const Product = require("../models/product");


// STORAGE CONFIG
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flowershop-products",
    allowedFormats: ["jpeg", "png", "jpg", "webp"]
  }
});

const upload = multer({storage});



// Helper to generate next product code (0001, 0002...)
async function generateProductCode() {
    const products = await Product.find({ 
        productCode: { $regex: /^\d{4}$/ } 
    }).sort({ productCode: -1 }).limit(1);
    
    if (products.length > 0 && products[0].productCode) {
        const lastCode = parseInt(products[0].productCode);
        return (lastCode + 1).toString().padStart(4, '0');
    }
    return '0001';
}

// ADD PRODUCT
router.post("/", upload.single("image"), async(req,res)=>{
try{
    let productCode = req.body.productCode;
    if (!productCode || productCode.trim() === "") {
        productCode = await generateProductCode();
    }

    // Normalize category to always be an array
    const categoryRaw = req.body.category;
    const categoryArr = Array.isArray(categoryRaw) ? categoryRaw : (categoryRaw ? [categoryRaw] : []);

    const product = new Product({
        name:req.body.name,
        category: categoryArr,
        price:req.body.priceMedium || req.body.price,
        priceSmall:req.body.priceSmall,
        priceMedium:req.body.priceMedium,
        priceLarge:req.body.priceLarge,
        description:req.body.description,
        productCode:productCode,
        productDetails:req.body.productDetails,
        image: req.file ? req.file.path : ""
    });
    await product.save();
    res.json(product);
}catch(err){
    console.error("DEBUG UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message ? err.message : JSON.stringify(err) });
}
});

// GET PRODUCTS
router.get("/", async(req,res)=>{
const products = await Product.find().sort({_id:-1});
res.json(products);
});

// DELETE PRODUCT
router.delete("/:id", async(req,res)=>{
await Product.findByIdAndDelete(req.params.id);
res.json({message:"deleted"});
});

// UPDATE PRODUCT
router.put("/:id", upload.single("image"), async(req,res)=>{
try{
    // Normalize category to always be an array
    const categoryRaw = req.body.category;
    const categoryArr = Array.isArray(categoryRaw) ? categoryRaw : (categoryRaw ? [categoryRaw] : []);

    const updateData = {
        name:req.body.name,
        category: categoryArr,
        price:req.body.priceMedium || req.body.price,
        priceSmall:req.body.priceSmall,
        priceMedium:req.body.priceMedium,
        priceLarge:req.body.priceLarge,
        description:req.body.description,
        productCode:req.body.productCode,
        productDetails:req.body.productDetails
    };
    if(req.file){
        updateData.image = req.file.path;
    }
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { returnDocument: 'after' }
    );
    res.json(product);
}catch(err){
    res.status(500).json(err);
}
});



module.exports = router;