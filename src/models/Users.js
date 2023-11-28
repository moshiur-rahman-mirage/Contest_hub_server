const { model, Schema, default: mongoose } = require("mongoose");

const Users = new Schema({
    
    'img':{
        type:String ,
        required: true
    },
    "name":{
        type:String ,
        required: true
    },
    "email":{
        type:String ,
        required: true,
        unique: true
    },
    "participatedContests": [{
         type: Schema.Types.Array,
        //contestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contest' }
      }],
   
})


module.exports = Users