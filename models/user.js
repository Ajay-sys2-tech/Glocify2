const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const jwt = require("jsonwebtoken");
require('dotenv').config();

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    phone: {type: Number, required: true, unique: true},
    password: {type: String, required: true},
    // gender: {type: String, required: true},
    tokens: [{
        token:  {type: String, required: true}
    }]
});

userSchema.methods.generateAuthToken = async function(){
    try {
        console.log("token creating");
        const token = jwt.sign({_id: this._id}, process.env.SECRET_KEY); 
        this.tokens = this.tokens.concat({token:token});
        // console.log(token);
        await this.save();
        return token;
    } catch (error) {
        res.send("Something went wrong while creating the token!!");
        console.log(error);
    }
}


userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hash(password, bcrypt.genSalt(5), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const Register = new mongoose.model('User', userSchema);

module.exports = Register;