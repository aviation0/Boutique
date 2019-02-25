var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    Product         = require("./models/product");
    
var productRoutes   = require("./routes/products"),
    indexRoutes     = require("./routes/index");
    
mongoose.connect("mongodb://localhost/boutique");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//PASSPORT CONFIGURATION==================================
app.use(require("express-session")({
    secret: "dont do a mundane job",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//PROVIDING CURRENT USER ID IN ALL TEMPLATES
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
});

//========================================================


app.use(indexRoutes);
app.use("/products", productRoutes);

app.listen(process.env.PORT, process.env.ID, function(){
   console.log("The server is now running..."); 
});