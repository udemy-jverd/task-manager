const User = require('../model/user');
const generateAuthToken = require('../utils/authToken');
const { isMatching, hash } = require('../utils/encryption');

const login = async (req, res) => {
    const { body } = req;
    try {
        const user = await User.findOne({ email: body.email });
        if (!user) {
            throw new Error('Unable to login!');
        }
        const rightPassword = isMatching(body.password, user.password);
        if (!rightPassword) {
            throw new Error('Unable to login!');
        }
        const token = generateAuthToken(user._id.toString());
        user.tokens = user.tokens.concat({ token });
        await user.save();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
}

const signup = async (req, res) => {
    const user = new User(req.body);
    try {
        const token = generateAuthToken(user._id.toString());
        user.tokens = user.tokens.concat({ token });
        user.password = await hash(req.body.password);
        await user.save();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send(e);
    }
}

const logoutAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { login, signup, logout, logoutAll };
