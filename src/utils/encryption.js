const bcrypt = require('bcryptjs');

const isMatching = async (string, hash) => {
    const isMatch = await bcrypt.compare(string, hash);
    return isMatch;
}

const hash = async (string) => {
    const hashed = await bcrypt.hash(string, 8);
    return hashed;
};

module.exports = { isMatching, hash };
