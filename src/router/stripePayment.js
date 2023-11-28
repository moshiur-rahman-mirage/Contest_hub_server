const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
require("dotenv").config();

const stripe = require('stripe')(process.env.STRIPE_SECRET)



router.post('/create-payment-intent', async (req, res) => {
    const { price } = req.body;
    if(price>0){
    const amount = parseInt(price * 100);
    console.log(amount, 'amount inside the intent')

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card']
    });


    res.send({
        clientSecret: paymentIntent.client_secret
    })
}
});




module.exports = router;