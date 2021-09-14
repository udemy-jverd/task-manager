const express = require('express');
const { me, getSingle, signup,
    updateOne, deleteOne, login } = require('../repository/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/login', login);
router.get('/users/me', auth, me);
router.get('/users/:id', getSingle);
router.post('/signup', signup);
router.patch('/users/:id', updateOne);
router.delete('/users/:id', deleteOne);

module.exports = router;
