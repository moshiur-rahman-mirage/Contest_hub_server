
const mongoose = require('mongoose');
const { Schema,model } = require('mongoose');

const Submissions = new Schema({
    contest_id: {
        type: String,
        require: true
    },
    submitted_by: {
        type: String,
        require: true
    },
    submit_description: {
        type: String,
        require: true
    },
    submission_date: {
        type: Date
    }
   

})
module.exports = Submissions
