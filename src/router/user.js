const express = require('express');
const { me, updateFields, deleteOne } = require('../repository/user');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/users/me', auth, me);
router.patch('/users/me', auth, updateFields);
router.delete('/users/me', auth, deleteOne);

module.exports = router;
