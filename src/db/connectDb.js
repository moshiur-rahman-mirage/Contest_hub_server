const mongoose = require("mongoose");
require("dotenv").config();


const connectDB = async () => {
  console.log("connectting to database");
  const mongoURI = 'mongodb+srv://librarian:Ms121212@cluster0.hhabjy4.mongodb.net/?retryWrites=true&w=majority'

  await mongoose.connect(mongoURI, { dbName: process.env.DB_NAME });
  console.log("connected to database");
};


module.exports= connectDB