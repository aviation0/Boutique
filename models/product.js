var mongoose = require("mongoose");

var ProductSchema = new mongoose.Schema({
   title: String,
   subTitle: String,
   productDetails: String,
   basePrice: String,
   discountPrice: String,
   discountPercentage: String,
   isAvailable: Boolean,
   category: String
});

module.exports = mongoose.model("Product", ProductSchema);