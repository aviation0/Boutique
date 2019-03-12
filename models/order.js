var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    //orderTime: String,
    //totalAmount: String,
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }    
    ],
    buyer: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
});

module.exports = mongoose.model("Order", orderSchema);