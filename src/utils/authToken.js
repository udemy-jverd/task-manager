const jwt = require('jsonwebtoken');

const generateAuthToken = (_id = String) => {
    const token = jwt.sign({ _id }, process.env.JWT_SECRET);
    return token;
}

module.exports = generateAuthToken;
