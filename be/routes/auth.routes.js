const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/auth.controller');
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware');

// Public routes
router.post('/login', isNotAuthenticated, login);

// Protected routes
router.post('/logout', isAuthenticated, logout);

module.exports = router;