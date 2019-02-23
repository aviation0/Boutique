var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    wishlist: [
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
    ]
});

module.exports = mongoose.model("User", UserSchema);