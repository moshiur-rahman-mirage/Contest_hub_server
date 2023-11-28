// import packages
const express = require('express')
const mongoose = require('mongoose')
const contestRouter = require('./router/contestRouter');
const userRouter = require('./router/userRouter');
const submissionRouter = require('./router/submissionRoute');
const stripePayment = require('./router/stripePayment');
const paymentRoute = require('./router/paymentRoute');
const applyMiddleware = require('./applyMiddleWare/applyMiddleware');
const app=express();
app.use(express.json());
require("dotenv").config();

applyMiddleware(app);

mongoose.connect(`${process.env.CONNECTION_STRING}`,{ 
    dbName: `${process.env.DB_NAME}`
})
.then(()=>{
    console.log('connection successful!')
})
.catch((error)=>{
    console.log(error)
})

app.get("/health", (req, res) => {
    res.send("is running....");
  });


app.use('/contest',contestRouter);
app.use('/users',userRouter);
app.use('/submission',submissionRouter);
app.use('/stripe',stripePayment);
app.use('/payments',paymentRoute)


app.listen(5000,()=>{
    console.log('Contest running')
})
