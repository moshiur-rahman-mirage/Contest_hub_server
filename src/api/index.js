const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


mongoose.connect(`${process.env.CONNECTION_STRING}`,{ 
    dbName: `${process.env.DB_NAME}`
})
// Your routes and middleware go here

module.exports = app;
