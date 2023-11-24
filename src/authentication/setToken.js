const createToken = require('./createToken')

const setToken = (req, res, next) => {
    try {
        const user = req.body;
        const token = createToken(user)
        console.log(token)
        res.send({ token });
    } catch (err) {
        next(err)
    }


}

module.exports = setToken