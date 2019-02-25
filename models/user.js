var mongoose                = require("mongoose");
var passportLocalMongoose   = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String/*,
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }    
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order"
        }    
    ]*/
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);