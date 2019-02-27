

var middlewareObj = {};


middlewareObj.isLoggedIn = function(req, res, next){
 if(req.isAuthenticated()){
   return next();
 }
 res.redirect("/login");
}

middlewareObj.notLoggedIn = function(req, res, next){
 if(!req.isAuthenticated()){
   return next();
 }
 res.redirect("/");
}

module.exports = middlewareObj;