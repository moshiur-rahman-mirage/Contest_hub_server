const { model, Schema, default: mongoose } = require("mongoose");
const Contest = require('./Contests');
const userSchema = new Schema({

    'img': {
        type: String,
        required: true
    },
    "name": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: true,
        unique: true
    },
    "role":{
        type:String,
        // default:"user"
    },
    "win":{
        type:Number,
        // default:"user"
    },
    participatedContests: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest',
    }
],

})

const Users=model('User',userSchema);
module.exports = Users