var express = require("express");
var router  = express.Router();
var Product = require("../models/product");
var User    = require("../models/user");
var middleware = require("../middleware");

router.get("/cart", middleware.isLoggedIn, function(req, res){
    User.findById(req.user, {cart:1}).populate("cart").exec(function(err, foundUserCart){
       if(err){
           console.log(err);
           res.send("some error");
       } else{
           res.send(foundUserCart);
       }
    });
});


//add to cart
router.get("/products/:category/:id/addToCart", middleware.isLoggedIn, function(req, res){
    Product.findById(req.params.id, function(err, foundProduct){
        if(err){
            console.log(err);
            res.send("not added");
        
        } else{
        
            //var foundProductId = String(foundProduct.id);
            req.user.cart.push(foundProduct);
            req.user.save();
            console.log("added");
            res.send("added to cart");
        }
    });
});

//remove from cart
router.get("/products/:category/:id/removeFromCart", middleware.isLoggedIn, function(req, res){
   req.user.cart.pull({ _id : req.params.id });
   req.user.save();
   res.send("product removed from cart");
});

module.exports = router;