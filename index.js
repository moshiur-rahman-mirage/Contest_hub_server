require("dotenv").config();
const http=require('http')
const app=require('./src/app.js')
const server=http.createServer(app)
const mongoose = require('mongoose')
const express = require('express')
app.use(express.json());
const main= async ()=>{
    await mongoose.connect(`${process.env.CONNECTION_STRING}`,{ 
        dbName: `${process.env.DB_NAME}`
    })
    .then(()=>{
        console.log('connection successful!')
    })
    .catch((error)=>{
        console.log(error)
    })
}

main();