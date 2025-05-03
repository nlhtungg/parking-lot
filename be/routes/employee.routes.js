const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee.controller');
const notiController = require('../controllers/admin.noti.controller');
const sessionsController = require('../controllers/employee.sessions.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.isAuthenticated, authMiddleware.hasRole(['employee']));

router.get('/', employeeController.getDashboard);

router.get('/notifications', notiController.getAllNotifications);
router.get('/notifications/:id', notiController.getNotificationById);

// Parking sessions routes
router.get('/parking-sessions', sessionsController.getActiveSessions);
router.post('/parking-sessions', sessionsController.checkInVehicle);
router.put('/parking-sessions/:id', sessionsController.checkOutVehicle);

module.exports = router;