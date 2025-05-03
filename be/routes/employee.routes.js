const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee.controller');
const notiController = require('../controllers/admin.noti.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.isAuthenticated, authMiddleware.hasRole(['employee']));

router.get('/', employeeController.getDashboard);

router.get('/notifications', notiController.getAllNotifications);
router.get('/notifications/:id', notiController.getNotificationById);

module.exports = router;