var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    Product         = require("./models/product");
    
mongoose.connect("mongodb://localhost/boutique");


/*Product.create({
    title: "Pink Sabyasachi Saree",
    subTitle: "Best of sil sarees",
    productDetails: "No such details yet",
    basePrice: "12999",
    discountPrice:"8999",
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

 
app.get("/", function(req, res){
    
    Product.find({},function(err,allProducts){
       if(err) {
           console.log(err);
       } else {
           console.log(allProducts);
           res.send(JSON.stringify(allProducts));
       }
    });
   /*res.send("Home page"); */
});

app.listen(process.env.PORT, process.env.ID, function(){
   console.log("The server is now running..."); 
});