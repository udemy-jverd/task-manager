const express = require('express');
const { getMany, getSingle, create,
    updateOne, deleteOne } = require('../repository/task');

const router = new express.Router();

router.get('/tasks', getMany);
router.get('/tasks/:id', getSingle);
router.post('/tasks', create);
router.patch('/tasks/:id', updateOne);
router.delete('/tasks/:id', deleteOne);

module.exports = router;
