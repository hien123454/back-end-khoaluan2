const express = require('express');
const router = express.Router();
const AuthsRouter = require('./auth');
const UsersRouter = require('./users');
router.use('/auth', AuthsRouter);
router.use('/users', UsersRouter);

module.exports = router;
