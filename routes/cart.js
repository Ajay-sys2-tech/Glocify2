const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');
const Product = require('../models/product');
const auth = require("../middlewares/auth");

router.get('/add-to-cart/:id', function (req, res) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function (err, product) {
        if(err) {
            console.log(err);
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/user/display');
        
    })
});

router.get('/reduce/:id', function (req, res, next) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/cart/myCart');
});

router.get('/remove/:id', function (req, res, next) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/cart/myCart');
});

router.get('/myCart', auth, function (req, res, next) {
    if(!req.session.cart) {
        return res.render('users/myCart', {products: null});
    }
    const cart = new Cart(req.session.cart);
    return res.render('users/myCart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

module.exports = router;
