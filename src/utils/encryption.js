const bcrypt = require('bcryptjs');

const isMatching = (string, hash) => {
    const isMatch = bcrypt.compare(string, hash);
    return isMatch;
}

const hash = async (string) => {
    const hashed = await bcrypt.hash(string, 8);
    return hashed;
};

module.exports = { isMatching, hash };
