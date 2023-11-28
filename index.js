require("dotenv").config();
const http=require('http')
const app=require('./src/app.js')
const server=http.createServer(app)
const mongoose = require('mongoose');
const connectDB = require("./src/db/connectDb.js");
const port=5000;

const main= async ()=>{
   await connectDB();
   server.listen(port,()=>{
    console.log('server is running on port',port)
   })
}

main();