const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee.controller');
const notiController = require('../controllers/admin.noti.controller');
const sessionsController = require('../controllers/employee.sessions.controller');
const lotsController = require('../controllers/admin.lots.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.isAuthenticated, authMiddleware.hasRole(['employee']));

router.get('/', employeeController.getDashboard);

router.get('/notifications', notiController.getAllNotifications);
router.get('/notifications/:id', notiController.getNotificationById);

// Parking lots route
router.get('/parking-lots', lotsController.getAllParkingLots);

// Parking sessions routes
router.get('/parking-sessions', sessionsController.getActiveSessions);
router.post('/parking-sessions', sessionsController.checkInVehicle);

// New entry/exit API endpoints
router.post('/parking/entry', sessionsController.checkInVehicle);
router.get('/parking/exit/:session_id', sessionsController.initiateCheckout); // Changed to GET with parameter
router.post('/parking/exit/confirm', sessionsController.confirmCheckout);

module.exports = router;