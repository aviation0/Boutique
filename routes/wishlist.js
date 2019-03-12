var express = require("express");
var router  = express.Router();
var Product = require("../models/product");
var User    = require("../models/user");

router.get("/wishlist", function(req, res){
    User.findById(req.user, {wishlist:1}).populate("wishlist").exec(function(err, foundUserWishlist){
       if(err){
           console.log(err);
           res.send("some error");
       } else{
           res.send(foundUserWishlist);
       }
    });
});

module.exports = router;