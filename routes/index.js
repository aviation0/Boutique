var express = require("express");
var router  = express.Router();
var passport= require("passport");
var User    = require("../models/user");


router.get("/",function(req, res){
  res.render("landing");
});

// AUTH ROUTES =================================

//SHOW
router.get("/register", function(req, res) {
   res.render("register"); 
});

//HANDLE SIGNUP LOGIC
router.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
     if(err){
       return res.render("register");
     }
     //LOGGING IN AFTER SUCCESSFULL REGISTRATION
     passport.authenticate("local")(req, res, function(){
       res.redirect("/");
     });
   });
});

// Show Login Form
router.get("/login", function(req, res) {
  res.render("login");    
});

//USES REQ.BODY.USERNAME && REQ.BODY.PASSWORD
router.post("/login", passport.authenticate("local", 
  {
   successRedirect : "/",
   failureRedirect : "/login"
  }), function(req, res) {
  
});

//log out 
router.get("/logout", function(req, res) {
   req.logout();//session ends
   res.redirect("/");
});

module.exports = router;