var express    = require("express");
var router     = express.Router();
var passport   = require("passport");
var User       = require("../models/user");
var middleware = require("../middleware");
var async      = require("async");
var nodemailer = require("nodemailer");
var crypto     = require("crypto");


router.get("/",function(req, res){
  res.render("landing");
});

// AUTH ROUTES =================================

//SHOW
router.get("/register", middleware.notLoggedIn, function(req, res) {
   res.render("register"); 
});

//HANDLE SIGNUP LOGIC
router.post("/register", function(req, res) {
   var messages = [];
   req.checkBody('email', 'Invalid email').notEmpty().isEmail();
   req.checkBody('username', 'Invalid username').notEmpty().isLength({min:5}).withMessage('Username must be at least 5 chars long');
   req.checkBody('password', 'Invalid password').notEmpty().isLength({min:6}).withMessage('Password must be at least 6 chars long');
   var errors = req.validationErrors();
   if(errors){
      errors.forEach(function(error){
         messages.push(error.msg);
      });
      return res.send(JSON.stringify(messages));
   }
   var newUser = new User({username: req.body.username,email: req.body.email});
   User.register(newUser, req.body.password, function(err, user){
     if(err){
         messages.push(err.message);
       return res.send(JSON.stringify(messages));
     }
     //LOGGING IN AFTER SUCCESSFULL REGISTRATION
     passport.authenticate("local")(req, res, function(){
       res.redirect("/");
     });
   });
});

// Show Login Form
router.get("/login", middleware.notLoggedIn, function(req, res) {
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

//FORGOT PASSWORD
router.get("/forgot", function(req, res) {
   res.render("forgot"); 
});

router.post("/forgot", function(req, res, next){
   async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          /*req.flash('error', 'No account with that email address exists.');*/
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'avi.anand.kasba@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'avi.anand.kasba@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        /*req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');*/
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      /*req.flash('error', 'Password reset token is invalid or has expired.');*/
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
           console.log("Password reset token is invalid or has expired");
          /*req.flash('error', 'Password reset token is invalid or has expired.');*/
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
           console.log("Passwords do not match");
            /*req.flash("error", "Passwords do not match.");*/
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'avi.anand.kasba@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'avi.anand.kasba@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
         console.log("Sucess mail sent");
        /*req.flash('success', 'Success! Your password has been changed.');*/
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});


//USER PROFILE
router.get("/users/:id", middleware.isLoggedIn, function(req, res) {
   User.findById(req.params.id, function(err, foundUser){
      if(err){
          console.log(err);
      } else{
          res.send(JSON.stringify(foundUser));
      }
   });
});

module.exports = router;