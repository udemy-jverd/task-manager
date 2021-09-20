const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Task = require('../../src/model/task');
const User = require('../../src/model/user');
const { hash } = require('../../src/utils/encryption');

const firstUserId = new mongoose.Types.ObjectId();
const firstUser = {
    _id: firstUserId,
    name: 'Test',
    email: 'test@gmail.com',
    password: '1234567890',
    tokens: [{
        token: jwt.sign({ _id: firstUserId }, process.env.JWT_SECRET)
    }]
}

const secondUserId = new mongoose.Types.ObjectId();
const secondUser = {
    _id: secondUserId,
    name: 'Bob',
    email: 'bob@gmail.com',
    password: '1234567890',
    tokens: [{
        token: jwt.sign({ _id: secondUserId }, process.env.JWT_SECRET)
    }]
}

const firstTask = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Watch batman',
    completed: false,
    owner: firstUser._id
}
const secondTask = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Watch ironman',
    completed: true,
    owner: secondUser._id
}

const populateDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();

    const user = await new User(firstUser);
    user.password = await hash(firstUser.password);
    user.save();
    const userTwo = await new User(secondUser);
    userTwo.password = await hash(secondUser.password);
    userTwo.save();
    await new Task(firstTask).save();
    await new Task(secondTask).save();
}

module.exports = {
    firstUserId, firstUser, secondUser,
    firstTask, secondTask, populateDatabase
}
