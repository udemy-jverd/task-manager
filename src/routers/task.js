const express = require('express');
const { getMany, getSingle, create,
    updateOne, deleteOne } = require('../repositories/user');

const router = new express.Router();

router.get('/tasks', (req, res) => getMany(req, res));
router.get('/tasks/:id', async (req, res) => getSingle(req, res));
router.post('/tasks', async (req, res) => create(req, res));
router.patch('/tasks/:id', async (req, res) => updateOne(req, res));
router.delete('/tasks/:id', async (req, res) => deleteOne(req, res));

module.exports = router;
