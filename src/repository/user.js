const sharp = require('sharp');
const Task = require('../model/task');
const User = require('../model/user');
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
        res.status(204).send(user);
    } catch (e) {
        res.status(500).send(e);
    }
}

const getProfilePicture = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user || !user.avatar) {
            throw new Error('Unable to find the user or the profile picture!');
        }
        res.set('Content-Type', 'image/png');
        res.status(200).send(user.avatar);
    } catch (e) {
        res.status(404).send({ error: e.message });
    }
}

const uploadPicture = async (req, res) => {
    const { user, file } = req;
    try {
        user.avatar = await sharp(file.buffer).resize({
            width: 250,
            height: 250
        }).png().toBuffer();
        await user.save();
        res.status(202).send();
    } catch (e) {
        res.status(500).send(e);
    }
}

const deletePicture = async (req, res) => {
    const { user } = req;
    try {
        user.avatar = null;
        await user.save();
        res.status(204).send();
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = {
    me, updateFields, deleteOne,
    getProfilePicture, uploadPicture, deletePicture
};
