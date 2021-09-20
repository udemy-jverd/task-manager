const Task = require('../model/task');

const create = async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id });
    try {
        const newTask = await task.save();
        res.status(201).send(newTask);
    } catch (e) {
        res.status(500).send(e);
    }
}

const getMany = async (req, res) => {
    const { query } = req;
    let builtQuery = { owner: req.user._id }
    if (query.completed) {
        builtQuery = { ...query, completed: query.completed };
    }
    const sort = {};
    if (query.sortBy) {
        const parts = query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        const tasks = await Task.find(
            builtQuery,
            null,
            {
                limit: parseInt(query.limit),
                skip: parseInt(query.skip),
                sort
            }
        );
        res.status(200).send(tasks);
    } catch (e) {
        res.status(500).send(e);
    }
}

const getSingle = async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await Task.findOne({ _id: taskId, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
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
        const task = await Task.findOne({ _id: params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.status(202).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
}

const deleteOne = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            id: req.params.id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).send();
        }
        res.status(204).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
}

module.exports = { create, getMany, getSingle, updateOne, deleteOne };
