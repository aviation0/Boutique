var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    Product         = require("./models/product");
    
var productRoutes   = require("./routes/products");
    
mongoose.connect("mongodb://localhost/boutique");

app.use(bodyParser.urlencoded({extended: true}));

/*Product.create({
    title: "Rajashthani Saree",
    subTitle: "A test description",
    productDetails: "No such details yet",
    basePrice: "14999",
    discountPrice:"9999",
    discountPercentage: "none",
    isAvailable: true,
    category: "Saree"
}, function(err, product){
   if(err){
       console.log("Error in creating product");
   } else{
       console.log("Created one product");
   }
});*/

 
/*app.get("/", function(req, res){
    
    Product.find({},function(err,allProducts){
       if(err) {
           console.log(err);
       } else {
           console.log(allProducts);
           res.send(JSON.stringify(allProducts));
       }
    });
});*/


app.use("/products", productRoutes);

app.listen(process.env.PORT, process.env.ID, function(){
   console.log("The server is now running..."); 
});