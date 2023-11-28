
const mongoose = require('mongoose');
const { Schema,model } = require('mongoose');

const Payment = new Schema({
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
module.exports = Payment
