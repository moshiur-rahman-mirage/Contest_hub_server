require("dotenv").config();

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log(req)
  if (!req.headers.authorization) {
    console.log(req)
    return res.status(401).send({ message: 'Forbidden Access!' });
  }
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Forbidden Access!' });
    }
    req.decoded = decoded
    next();
  })
};

module.exports = verifyToken;