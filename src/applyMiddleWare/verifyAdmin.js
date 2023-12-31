const Users = require("../models/Users");


const verifyAdmin = async (req, res, next) => {
  console.log('verify admin')
    const email = req.decoded.email;
    const query = { email: email };
    const user = await Users.findOne(query);
    const isAdmin = user?.role === 'admin'
    if (!isAdmin) {
      return res.status(403).send({ message: 'unauthorized access' });
    } else {
      next();
    }
  }


  module.exports = verifyAdmin;