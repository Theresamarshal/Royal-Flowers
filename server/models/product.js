const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
name:String,
category:[String],
price:Number,
priceSmall:Number,
priceMedium:Number,
priceLarge:Number,
description:String,
productCode:String,
productDetails:String,
image:String
});

module.exports = mongoose.model("Product", productSchema);