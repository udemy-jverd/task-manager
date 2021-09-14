const jwt = require('jsonwebtoken');
const User = require('../model/user');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secretKey');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error();
        }
        req.user = user;
    } catch (e) {
        console.log(e);
        return res.status(401).send({ error: 'Please authenticate.' });
    }
    next();
}

module.exports = auth;
