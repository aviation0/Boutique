var express = require("express");
var router  = express.Router();
var Order = require("../models/order");
var User = require("../models/user");
var middleware = require("../middleware");

//GET - all orders (for admin side)
router.get("/allOrders", middleware.isLoggedIn, function(req, res){
    Order.find({}, function(err, allOrders){
       if(err){
           console.log(err);
       } else{
           res.send(JSON.stringify(allOrders));
       }
    });
});

//GET - users orders
router.get("/orders", middleware.isLoggedIn, function(req, res){
   User.findById(req.user, {orders : 1}).populate("orders").exec(function(err, foundUserOrders){
      if(err){
          console.log(err);
          res.send("some error");
      } else{
          res.send(foundUserOrders);
      }
   });
});

//placing order
router.get("/buy", middleware.isLoggedIn, function(req, res) {
   var orderItems = [];
   var billingAmount = 0;
   User.populate(req.user, "cart", function(err, foundUser){
      console.log(foundUser);
      
      if(foundUser.cart.length > 0) {
      
          foundUser.cart.forEach(function(item){
             orderItems.push(item);
             billingAmount+=parseInt(item.discountPrice);
          });
          
          //console.log(orderItems);
          //console.log(billingAmount);
          
          var newOrder = {
              items: orderItems,
              buyer: req.user.id,
              billingAmount: billingAmount,
              date: Date.now()
          }
          console.log(newOrder);
          
          Order.create(newOrder, function(err, newlyCreatedOrder){
             if(err){
                 console.log(err);
             } else{
                 req.user.orders.push(newlyCreatedOrder);
                 /*req.user.cart = [];*/
                 req.user.save();
                 res.send("Order Placed");
             }
          });
          
        } else {
            res.send("Cart is Empty");
        }
    });
});

//deleting an order
router.get("/:id/removeOrder", middleware.isLoggedIn, function(req, res){
    Order.findByIdAndDelete(req.params.id, function(err){
       if(err){
           console.log(err);
           res.send("Order not Deleted");
       } else {
           req.user.orders.pull({_id : req.params.id});
           req.user.save();
           res.send("Order Deleted");
       }
    });
});

module.exports = router;