var express = require("express");
var router  = express.Router();
var Order = require("../models/order");

//GET - all orders (for admin side)
router.get("/", function(req, res){
    Order.find({}, function(err, allOrders){
       if(err){
           console.log(err);
       } else{
           res.send(JSON.stringify(allOrders));
       }
    });
});

//CREATE - Individual order
/*router.post("/", function(req, res){
   var buyer = {
        id: req.user._id
   };
   
});*/

module.exports = router;