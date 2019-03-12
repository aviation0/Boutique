var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    session         = require("express-session"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    Product         = require("./models/product"),
    validator       = require("express-validator"),
    MongoStore      = require("connect-mongo")(session);
    
var productRoutes   = require("./routes/products"),
    wishlistRoutes  = require("./routes/wishlist"),
    cartRoutes  = require("./routes/cart"),
    indexRoutes     = require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/boutique";
mongoose.connect(url);

app.use(bodyParser.urlencoded({extended: true}));
app.use(validator());
app.set("view engine", "ejs");
app.use(flash()); //or use after express-session

//PASSPORT CONFIGURATION==================================
app.use(session({
    secret: "dont do a mundane job",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection : mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 } //3 minutes
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//PROVIDING CURRENT USER ID IN ALL TEMPLATES
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authentication, Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//========================================================


app.use(indexRoutes);
app.use(wishlistRoutes);
app.use(cartRoutes);
app.use("/products", productRoutes);


app.listen(process.env.PORT, process.env.ID, function(){
   console.log("The server is now running...");
});