var express = require("express");
var router  = express.Router();
var Product = require("../models/product");
var multer  = require("multer");

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'inventory', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//SEARCH - to find products with matching title and subtitle
router.get("/", function(req, res) {
   if(req.query.search){
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      //get matching products from db
      Product.find({$or:[{title: regex},{subTitle: regex}]}, function(err, matchingProducts){
         if(err){
            console.log(err);
         } else{
            if(matchingProducts.length < 1){
               res.send("No matching products found");
            } else{
               res.send(JSON.stringify(matchingProducts));
            }
         }
      });
   } else{
      res.redirect("/"); //handle this
   }
});

//INDEX - show all products of a category
router.get("/:category", function(req, res){
   Product.find({category: req.params.category}, function(err, products){
      if(err){
          console.log(err);
      } else{
          res.send(JSON.stringify(products));
      }
   });
});

//CREATE - add new products
router.post("/", upload.array('image'),function(req, res){
   console.log(req.files);
   res.send("trying");
   /*var upload = async function(err, image){
      var result = [];
      for(int i = 0 ; i < 2; ++i){
         result[i] = await cloudinary.v2.uploader.upload(req.files[i].path);
      }
      
   }
   console.log(result);*/
   /*//create new product and save to db
   Product.create(req.body.product, function(err, newlyCreatedProduct){
      if(err){
          console.log(err);
      } else{
          //res.redirect("/products/");
          res.send(JSON.stringify(newlyCreatedProduct));
      }
   });*/
});



//SHOW - show more info about one product
router.get("/:category/:id", function(req, res){
   //find the product with the provided id
   Product.findById(req.params.id, function(err, product){
       if(err){
           console.log(err);
       } else{
           res.send(JSON.stringify(product));
       }
   });
});

//UPDATE - update old product
router.put("/:category/:id", function(req, res){
   Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct){
      if(err){
         res.send(err);
      } else{
         res.send(JSON.stringify(updatedProduct));
      }
   });
});

//DESTROY - delete old product
router.delete("/:category/:id", function(req, res){
   Product.findByIdAndDelete(req.params.id, function(err){
      if(err){
         console.log(err);
      } else{
         res.send("Deletion Successfull");
      }
   });
});

//for fuzzy search regex
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;