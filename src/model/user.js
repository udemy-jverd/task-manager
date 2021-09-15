const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('../model/task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: [10, 'Password must contains at least 10 characters!'],
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"!');
            }
        }
    }, tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// Allow accessing the tasks directly from the User model
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// static methods are accessibles from the model and instance methods are accessibles from instances
userSchema.methods.generateAuthToken = function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, 'secretKey');
    return token;
}

// toJSON method run even we never call it explicitly
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    return user;
}

// Here we create the findByCredentials method in the User object
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Unable to login!');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login!');
    }
    return user;
}

// This middleware hash the plain text password before saving
userSchema.pre('save', async function (next) {
    // using default function instead of arrow to bind this
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// This middleware remove the user tasks when it profile is deleted
userSchema.pre('remove', async function (next) {
    await Task.deleteMany({ owner: this._id });
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
