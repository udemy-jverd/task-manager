const User = require('../model/user');

const me = async (req, res) => {
    res.status(200).send(req.user);
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

const updateOne = async (req, res) => {
    const { body, params } = req;
    const updates = Object.keys(body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' });
    }
    try {
        const user = await User.findById(params.id);
        if (!user) {
            return res.status(404).send();
        }
        updates.forEach((update) => user[update] = body[update]);
        await user.save();
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

module.exports = { me, getSingle, updateOne, deleteOne };
