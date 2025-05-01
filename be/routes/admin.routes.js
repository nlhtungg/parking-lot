const express = require('express');
const router = express.Router();

// Import controllers
const adminController = require('../controllers/admin.controller');
const adminUsersController = require('../controllers/admin.users.controller');
const adminLotsController = require('../controllers/admin.lots.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMonthlySubsController = require('../controllers/admin.monthlysubs.controller');
const adminFeeConfigController = require('../controllers/admin.feeConfig.controller');

// Middleware for all admin routes
router.use(authMiddleware.isAuthenticated, authMiddleware.hasRole(['admin']));

// Dashboard
router.get('/', adminController.getDashboard);

// Users Management
router.get('/users', adminUsersController.getAllUsers);
router.get('/users/:id', adminUsersController.getUserById);
router.post('/users', adminUsersController.createUser);
router.put('/users/:id', adminUsersController.updateUser);
router.delete('/users/:id', adminUsersController.deleteUser);
router.get('/employees/available', adminUsersController.getAvailableEmployees);

// Parking Lots Management
router.get('/parking-lots', adminLotsController.getAllParkingLots);
router.get('/parking-lots/:id', adminLotsController.getParkingLotById);
router.post('/parking-lots', adminLotsController.createParkingLot);
router.put('/parking-lots/:id', adminLotsController.updateParkingLot);
router.delete('/parking-lots/:id', adminLotsController.deleteParkingLot);

// Monthly Subs Management
router.get('/monthly-subs', adminMonthlySubsController.getAllMonthlySubs);
router.post('/monthly-subs', adminMonthlySubsController.createMonthlySub);
router.delete('/monthly-subs/:id', adminMonthlySubsController.deleteMonthlySub);

// Fee Configurations
router.post('/fee-config', adminFeeConfigController.setServiceFee);

module.exports = router;