var express = require("express");
var router  = express.Router();
var Product = require("../models/product");
var User    = require("../models/user");
var middleware = require("../middleware");

router.get("/wishlist", middleware.isLoggedIn, function(req, res){
    User.findById(req.user, {wishlist:1}).populate("wishlist").exec(function(err, foundUserWishlist){
       if(err){
           console.log(err);
           res.send("some error");
       } else{
           res.send(foundUserWishlist);
       }
    });
});


//add to wishlist
router.get("/products/:category/:id/addToWishlist", middleware.isLoggedIn, function(req, res){
   Product.findById(req.params.id, function(err, foundProduct){
      if(err){
            console.log(err);
            res.send("not added");
            
      } else{
         
            var foundProductId = String(foundProduct.id);
            var inWishlist = false;
            //searching for product in users wishlist
            req.user.wishlist.forEach(function(wishlistItem){
               if(String(wishlistItem)===foundProductId){
                  inWishlist = true;
               }
            });
            //if product is not in wishlist
            if(!inWishlist){
               req.user.wishlist.push(foundProduct);
               req.user.save();
               console.log("added");
               res.send("added to wishlist");
            } else{
               res.send("already in wishlist");
            }
          
      }
   });
});

//remove from wishlist
router.get("/products/:category/:id/removeFromWishlist", middleware.isLoggedIn, function(req, res){
   req.user.wishlist.pull({ _id : req.params.id });
   req.user.save();
   res.send("product removed from wishlist");
});

module.exports = router;