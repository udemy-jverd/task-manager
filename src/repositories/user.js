const User = require('../models/user');

const getMany = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (e) {
        res.status(500).send(e);
    }
}

const getSingle = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

const create = async (req, res) => {
    const user = new User(req.body);
    try {
        const newUser = await user.save();
        res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateOne = async (req, res) => {
    const { body, params } = req;
    const updates = Object.keys(body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' });
    }
    try {
        const user = await User.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteOne = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(203).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { getMany, getSingle, create, updateOne, deleteOne };
