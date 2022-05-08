const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');

const router = express.Router();

require("../db/conn");

const user = require("../models/user");
const auth = require("../middlewares/auth");
const Shop = require("../models/shops");
const Product = require("../models/product");



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/catalog/")
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname) ; 
    }
})


const upload = multer({storage: fileStorage});


const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/product/")
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "--" + file.originalname) ; 
    }
})

const productUpload = multer({storage: productStorage});

router.get("/register", (req, res) =>{
    // console.log(fileStorage.destination);
    res.render("shops/register");
} );



// ------------Seller Registration------------

router.post("/register", upload.single('catalog'), async(req, res) =>{

    // console.log(req.file);
   
    try {

        if(req.body.password1 != req.body.password2){
            const message = "Both passwords should match";
            console.log("Password mismatch");
            return res.render("shops/register", {message: message} );
        }

        else if(await Shop.findOne({email: req.body.email})){
            const message = "email already exists";
            console.log("email already exists");
            return res.render("shops/register", {message: message} );
        }
        else{
            const newShop = new Shop({
                name: req.body.name,
                category: req.body.category,
                ownerName: req.body.ownerName,
                email: req.body.email,
                // phone: req.body.phone,
                panCard: req.body.panCard,
                password: req.body.password1
                
            });

            if(req.file)
            newShop.catalog = req.file.path;
    
            
              const saved = await newShop.save();
              if(saved)res.send("Shop registered succesfully!");
    
        }  
    } catch (error) {
        res.send(error);
    }
})


// ---------------------Seller Login------------------------

router.get("/login", (req, res) => {
    res.render("shops/login");
})

router.post("/login", async (req, res) => {
    
    try{
        const email = req.body.email;
        const password = req.body.password;


        const found = await Shop.findOne({email: req.body.email});
        

        if(!found) return res.send("User doesn't exist");


        const chkPassword = await bcrypt.compare(password, found.password);
        const id = found._id;
    
        const url = `/shops/addProduct/:${id}`; 
        console.log(id.toString());

        const myProducts = await Product.find({sellerID: `:${id}`});
        console.log(myProducts);

        if(chkPassword) return res.render(`shops/myShop`, {myShop: found, url: url, myProducts: myProducts});

        else return res.send("Invalid email or password");
    }

    catch (error) {
        console.log(error);
        return res.status(400).send("catch Invalid username or password");
    }
})



router.get("/addProduct/:id", (req, res) => {
    const id = req.params.id;
    res.render("shops/addProduct", {id: id});
})

// --------------Adding Products in the shop-----------------

router.post("/addProduct", productUpload.single('productImage'), async (req, res) => {
    try{

        const myProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            desc: req.body.description,
            sellerID: req.body.sellerID,
        });

        if(req.file)
        myProduct.image = req.file.path;

        const saveProduct = await myProduct.save();

        if(saveProduct)
        res.send("Product added successfully");
    }catch (error) {
        console.log(error);

    }
})


//showing the seller their registered shop and Products

// router.get("/myShop", (req, res) => {
//     res.render("shops/myShop")
// })

module.exports = router