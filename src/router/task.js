const express = require('express');
const { getMany, getSingle, create,
    updateOne, deleteOne } = require('../repository/task');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/tasks', auth, create);
router.get('/tasks', auth, getMany);
router.get('/tasks/:id', auth, getSingle);
router.patch('/tasks/:id', auth, updateOne);
router.delete('/tasks/:id', auth, deleteOne);

module.exports = router;
