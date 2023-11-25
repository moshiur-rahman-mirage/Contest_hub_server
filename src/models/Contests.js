
const mongoose = require('mongoose');
const { Schema,model } = require('mongoose');

const Contests = new Schema({
    contest_name: {
        type: String,
        require: true
    },
    contest_creator: {
        type: String,
        require: true
    },
    contest_description: {
        type: String,
        require: true
    },
    contest_prize: {
        type: String,
        require: true
    },
    contest_deadline: {
        type: Date,
        require: true
    },
    contest_image: {
        type: String,
        // require: true
    },
    contest_status: {
        type: String,
        default: 'Pending'
    },
    contest_price: {
        type: Number,
         require: true
    },
    contest_instruction: {
        type: String,
         require: true
    },
    contest_category: {
        type: String,
         require: true
    }


})
module.exports = Contests