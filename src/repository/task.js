const Task = require('../model/task');

const getMany = async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
}

const getSingle = async (req, res) => {
    const task = await Task.findById(req.params.id);
    try {
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        return res.status(200).send(task);
    }
}

const create = async (req, res) => {
    const task = new Task(req.body);
    try {
        const newTask = await task.save();
        res.status(201).send(newTask);
    } catch (e) {
        res.status(500).send(e);
    }
}

const updateOne = async (req, res) => {
    const { body, params } = req;
    const updates = Object.keys(body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' });
    }
    try {
        const task = await Task.findByIdAndUpdate(
            params.id,
            body,
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteOne = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).send();
        }
        res.status(203).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { getMany, getSingle, create, updateOne, deleteOne };
