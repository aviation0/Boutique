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
    },
    billingAmount : Number,
    date: Date
});

module.exports = mongoose.model("Order", orderSchema);