const express = require('express');
const router = express.Router();

// Import controllers
const { getDashboard } = require('../controllers/admin.controller');
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getAvailableEmployees
} = require('../controllers/admin.users.controller');
const {
    getAllParkingLots,
    getParkingLotById,
    createParkingLot,
    updateParkingLot,
    deleteParkingLot
} = require('../controllers/admin.lots.controller');

const { isAuthenticated, hasRole } = require('../middlewares/auth.middleware');

// Middleware for all admin routes
router.use(isAuthenticated, hasRole('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Users Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/employees/available', getAvailableEmployees);

// Parking Lots Management
router.get('/parking-lots', getAllParkingLots);
router.get('/parking-lots/:id', getParkingLotById);
router.post('/parking-lots', createParkingLot);
router.put('/parking-lots/:id', updateParkingLot);
router.delete('/parking-lots/:id', deleteParkingLot);

module.exports = router; 