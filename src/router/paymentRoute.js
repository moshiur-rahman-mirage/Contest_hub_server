const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Payments = require('../models/Payment');
// const verifyToken = require('../applyMiddleWare/verifyToken');
const userSchema = require('../models/Users')

// model
const Payment = new mongoose.model("Payment", Payments);
const User = new mongoose.model('User', userSchema);

router.post('/', async (req, res) => {
    const newPayment = new Payment(req.body);
    // console.log('here')
    const paymentResult = await newPayment.save()
    res.send(paymentResult);
    //  console.log(paymentResult.acknowledged)
    if (paymentResult._id) {
        console.log('inside acknowledge')
        const  email= newPayment.email ;
        console.log(newPayment)
        const contestIds=newPayment.contest_id;
         console.log(contestIds)
        addContestsToUser(email, contestIds)
       
    }
    // console.log(paymentResult)
})


async function addContestsToUser(email, contestIds) {
    try {

        // console.log(contestIds)
        const user = await User.findOne({ email })
        if(!user){
            console.log('user not found!')
        }else{
            // console.log('inside one step')
            // console.log(email)
            // console.log(contestIds)
            // console.log(user)
            // await User.updateOne(
            //     { email: email },
            //     {
            //       $push: {
            //         participatedContests: {
            //           $each: contestIds,
            //         },
            //       },
            //     }
            //   );
            User.participatedContests.push(...contestIds);
        }
        // user.participatedContests.push(...contestIds);

        // await user.save();

        console.log('Contests added to the user successfully.');
    } catch (error) {
        console.error('Error adding contests to user:', error.message);
    }
}



module.exports = router;