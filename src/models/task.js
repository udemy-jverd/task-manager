const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: [true, '"Description" field is required!'],
    },
    completed: {
        type: Boolean,
        default: false
    }
})

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
