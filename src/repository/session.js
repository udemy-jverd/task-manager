const User = require('../model/user');

const login = async (req, res) => {
    const { body } = req;
    try {
        const user = await User.findByCredentials(body.email, body.password);
        const token = await user.generateAuthToken();
        user.tokens = user.tokens.concat({ token });
        await user.save();
        res.status(200).send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
}

const signup = async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        user.tokens = user.tokens.concat({ token });
        const newUser = await user.save();
        res.status(200).send({ newUser, token });
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
