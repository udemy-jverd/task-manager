const express = require('express');
require('./db/mongoose');
const sessionRouter = require('./router/session');
const userRouter = require('./router/user');
const taskRouter = require('./router/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(sessionRouter);
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
