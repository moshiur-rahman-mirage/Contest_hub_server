
const mongoose = require('mongoose');
const { Schema,model } = require('mongoose');

const paymentSchema = new Schema({
    user_id: {
        type: String,
        require: true
    },
    contest_id: {
        type: String,
        require: true
    },
    email:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        require:true
    },
    transactionId:{
        type:String,
        require:true
    },
    price:{
        type:Number
    }
})
const Payment=model('Payment',paymentSchema);
module.exports = Payment
