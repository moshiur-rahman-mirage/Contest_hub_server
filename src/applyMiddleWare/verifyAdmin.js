const verifyAdmin = async (req, res, next) => {
    const email = req.decoded.email;
    const query = { email: email };
    const user = await userCollection.findOne(query);
    const isAdmin = user?.role === 'admin'
    if (!isAdmin) {
      return res.status(403).send({ message: 'unauthorized access' });
    } else {
      next();
    }
  }