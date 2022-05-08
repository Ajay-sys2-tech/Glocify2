const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const jwt = require("jsonwebtoken");
require('dotenv').config();



const productSchema = new Schema({
    name: {type: String, required: true},
    desc: {type: String, required: true},
    price: {type: Number, required: true},
    image: {type:String, required: true},
    sellerID: {type: String, required: true}, 
    rating: {type: Number}
});

productSchema.pre("save", async function(next) {
   
    this.image = this.image.substring(6);
    next();
});


const Product = new mongoose.model('Product', productSchema);

module.exports = Product;