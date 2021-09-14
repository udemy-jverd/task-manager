const express = require('express');
const { me, getSingle, updateOne, deleteOne } = require('../repository/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/users/me', auth, me);
router.get('/users/:id', getSingle);
router.patch('/users/:id', updateOne);
router.delete('/users/:id', deleteOne);

module.exports = router;
