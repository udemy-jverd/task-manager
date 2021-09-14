const express = require('express');
const { signup, login, logout, logoutAll } = require('../repository/session');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', auth, logout);
router.post('/logoutAll', auth, logoutAll);

module.exports = router;
