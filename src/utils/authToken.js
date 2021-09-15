const jwt = require('jsonwebtoken');

const generateAuthToken = (_id = String) => {
    const token = jwt.sign({ _id }, 'secretKey');
    return token;
}

module.exports = generateAuthToken;
