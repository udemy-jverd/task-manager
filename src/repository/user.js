const Task = require('../model/task');
const { hash } = require('../utils/encryption');

const me = async (req, res) => {
    res.status(200).send(req.user);
}

const updateFields = async (req, res) => {
    const { body, user } = req;
    const updates = Object.keys(body);
    const allowedUpdates = ['name', 'email', 'password'];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' });
    }
    try {
        updates.forEach((update) => user[update] = body[update]);
        if (body['password']) {
            console.log(body['password']);
            user['password'] = await hash(body['password']);
        }
        await user.save();
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteOne = async (req, res) => {
    const { user } = req;
    try {
        await Task.deleteMany({ owner: user._id });
        await user.remove();
        res.status(203).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { me, updateFields, deleteOne };
