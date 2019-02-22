var express         = require("express"),
    app             = express(),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override");
    
mongoose.connect("mongodb://localhost/boutique");
    
app.get("/", function(req, res){
   res.send("Home page"); 
});

app.listen(process.env.PORT, process.env.ID, function(){
   console.log("The server is now running..."); 
});