const express = require('express');
require('./db/mongoose');
const sessionRouter = require('./router/session');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();

app.use(express.json());
app.use(sessionRouter);
app.use(userRouter);
app.use(taskRouter);

module.exports = app;
