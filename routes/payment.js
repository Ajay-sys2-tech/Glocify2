const Razorpay = require('razorpay');
const express = require('express');
require('dotenv').config();

const router = express.Router();



var instance = new Razorpay({
    key_id: process.env.PAYMENT_ID,
    key_secret: process.env.PAYMENT_SECRET,
  });


  router.get("/checkout", (req, res) => {
      res.render("cart/checkout", {paymentId: process.env.PAYMENT_ID});
  })


  router.post("/create/orderId", (req, res) => {
      console.log("create orderId request", req.body);

      var options = {
        amount: req.body.amount,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      instance.orders.create(options, function(err, order) {
        console.log(order);

        res.send({orderId : order.id});
      });
  })



  router.post("/api/payment/verify",(req,res)=>{

    let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
   
     var crypto = require("crypto");
     var expectedSignature = crypto.createHmac('sha256', process.env.PAYMENT_SECRET)
                                     .update(body.toString())
                                     .digest('hex');
                                     console.log("sig received " ,req.body.response.razorpay_signature);
                                     console.log("sig generated " ,expectedSignature);
     var response = {"signatureIsValid":"false"}
     if(expectedSignature === req.body.response.razorpay_signature)
      response={"signatureIsValid":"true"}
         res.send(response);
     });


     module.exports = router;
   