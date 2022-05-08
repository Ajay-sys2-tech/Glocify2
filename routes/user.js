const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

require("../db/conn");

const user = require("../models/user");
const auth = require("../middlewares/auth");
const Product = require("../models/product");
const Shop = require("../models/shops");



//to show all the items 
router.get("/display", async (req, res) => {
    const allProducts = await Product.find();
    
    res.render("users/display", { products: allProducts });
})

//to show all the categories 
router.get("/categories", async (req, res) => {
    const allShops = await Shop.find({}, {category:1});
    res.send(allShops);
    
    
})


router.get("/register", (req, res) =>{
    res.render("users/register", {message: req.flash("message-e")});
} );





//create a new user
router.post("/register", async(req, res) =>{
    try {

        if(await user.findOne({email: req.body.email})){
            req.flash("message-e", "Email already Exists");
            return res.redirect("register");
        }

        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(password === confirmpassword){
            const newuser = new user({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                // gender: req.body.gender
            });

            const token = await newuser.generateAuthToken();

            res.cookie("jwt", token, { 
                expires: new Date(Date.now() + 3000000),
                httpOnly: true
         });
        

         // console.log(cookie);


            const savedUser = await newuser.save();
            if(savedUser){
                req.flash("message-s", "User added successfully!!!");
                res.redirect("login");
            }
            // res.send("User added successfully!!!");
        }else{
            req.flash("message-e", "Both the passwords should match");
            res.redirect("register");
            // res.send("Both the passwords should match");
        }

    }catch (error){
        console.log(error,"register error");
        req.flash("message-e", error.message);
        res.redirect("register");
        
        // res.status(400).send(error);
    }
} );


// Login form
router.get("/login", (req, res) => {
    res.render("users/login", {message: req.flash("message-s")});
});

//user login 
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const curruser = await user.findOne({email:email});
        if(!curruser)return res.send("User doesn't exist");

        const chkpassword = await bcrypt.compare(password, curruser.password
            // , (err, data) => {
            // if(err) throw err;
            // if(data)return res.status(200).send("User Logged in Successfulluy");
            // else return res.status(400).send("Invalid password");
        // }
        ) ;
        const token = await curruser.generateAuthToken();

        res.cookie("jwt", token, { 
            expires: new Date(Date.now() + 3000000),
            httpOnly: true
    });

        // console.log(curruser);
        if(chkpassword){
            // res.render("thankyou", {message: "You are succesfully logged in", nextPage:"/user/display"});
            return res.redirect("display");
        }else{
            return res.status(400).send("Invalid  password");
        }

    } catch (error) {
        return res.status(400).send("Invalid username or password");
    }
});





module.exports = router;