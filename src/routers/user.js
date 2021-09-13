const express = require('express');
const { getMany, getSingle, create,
    updateOne, deleteOne } = require('../repositories/user');

const router = new express.Router();

router.get('/users', (req, res) => getMany(req, res));
router.get('/users/:id', (req, res) => getSingle(req, res));
router.post('/users', async (req, res) => create(req, res));
router.patch('/users/:id', async (req, res) => updateOne(req, res));
router.delete('/users/:id', async (req, res) => deleteOne(req, res));

module.exports = router;
