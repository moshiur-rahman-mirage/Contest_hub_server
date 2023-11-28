const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Payments = require('../models/Payment');
// const verifyToken = require('../applyMiddleWare/verifyToken');
const User = require('../models/Users');
const Contest = require('../models/Contests');
const Payment = require('../models/Payment');

// model
// const Payments = mongoose.model("Payment", Payments);
// const User = mongoose.model('User', userSchema);

router.post('/', async (req, res) => {
    const newPayment = new Payment(req.body);
    // console.log('here')
    const paymentResult = await newPayment.save()
    res.send(paymentResult);
    //  console.log(paymentResult.acknowledged)
    if (paymentResult._id) {
        // console.log('inside acknowledge')
        const email = newPayment.email;
        // console.log(newPayment)
        const contestIds = newPayment.contest_id;
        // console.log(contestIds)
        addUserParticipatedContests(email, contestIds)

    }
    // console.log(paymentResult)
})


async function addUserParticipatedContests(email, contestIds) {
    try {
        const user = await User.findOne({ email: email });
        const id = user._id
        if (!user) {
            throw new Error('User not found.');
        }

        const contestIdsArray = Array.isArray(contestIds) ? contestIds : [contestIds];
        await User.updateOne(

            { _id: id },
            {
                $push: {
                    "participatedContests": {
                        $each: contestIdsArray,
                    },
                },
            }
        );

        console.log('Contest IDs added to the user successfully.');
        incrementParticipants(contestIds)
    } catch (error) {
        console.error('Error adding contest IDs to user:', error.message);
    } finally {
        //   mongoose.disconnect();
    }
}





async function incrementParticipants(contestId) {
    try {
        const filter={_id:contestId}
        const update={ $inc: { participants: 1 } }
        console.log(update)
       console.log(filter)
    //    console.log(Contests)
       const result= await Contest.findOneAndUpdate(filter, update, {
            new: true
          });


    } catch (error) {
        console.error('Error incrementing participants:', error.message);
    } finally {
        // mongoose.disconnect();
    }
}



module.exports = router;