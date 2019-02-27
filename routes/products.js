var express = require("express");
var router  = express.Router();
var Product = require("../models/product");

//INDEX - show all products of a category
router.get("/:category", function(req, res){
   Product.find({category: req.params.category}, function(err, products){
      if(err){
          console.log(err);
      } else{
          res.send(JSON.stringify(products));
      }
   });
});

//CREATE - add new products
router.post("/", function(req, res){
   console.log(req.body);
   
   //create new product and save to db
   Product.create(req.body.product, function(err, newlyCreatedProduct){
      if(err){
          console.log(err);
      } else{
          //res.redirect("/products/");
          res.send(JSON.stringify(newlyCreatedProduct));
      }
   });
});

//SHOW - show more info about one product
router.get("/:category/:id", function(req, res){
   //find the product with the provided id
   Product.findById(req.params.id, function(err, product){
       if(err){
           console.log(err);
       } else{
           res.send(JSON.stringify(product));
       }
   });
});

//UPDATE - update old product
router.put("/:category/:id", function(req, res){
   Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
      if(err){
         res.send(err);
      } else{
         res.send(JSON.stringify(updatedProduct));
      }
   });
});

//DESTROY - delete old product
router.delete("/:category/:id", function(req, res){
   Product.findByIdAndDelete(req.params.id, function(err){
      if(err){
         console.log(err);
      } else{
         res.send("Deletion Successfull");
      }
   });
});

module.exports = router;