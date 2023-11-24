const { model, Schema } = require("mongoose");

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
        required: true
    }
   
})


module.exports = Users