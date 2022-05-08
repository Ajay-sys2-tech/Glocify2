const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const jwt = require("jsonwebtoken");
require('dotenv').config();



const shopSchema = new Schema({
    name: {type: String, required: true},
    ownerName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    // phone: {type: Number, required: true, unique: true},
    password: {type: String, required: true},
    category: {type: String, required: true},
    panCard: {type: String, required: true},
    catalog: {type: String, required: true}
});

shopSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    this.catalog = this.catalog.substring(6);
    next();
    next();
});

shopSchema.methods.encryptPassword = function (password) {
    return bcrypt.hash(password, bcrypt.genSalt(5), null);
};

shopSchema.methods.validPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const Shop = new mongoose.model('Shop', shopSchema);

module.exports = Shop;