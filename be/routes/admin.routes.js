const express = require('express');
const router = express.Router();
const { 
    getDashboard,
    getAllParkingLots,
    getParkingLotById,
    createParkingLot,
    updateParkingLot,
    deleteParkingLot
} = require('../controllers/admin.controller');
const { isAuthenticated, hasRole } = require('../middlewares/auth.middleware');

// Middleware for all admin routes
router.use(isAuthenticated, hasRole('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Parking Lots Management
router.get('/parking-lots', getAllParkingLots);
router.get('/parking-lots/:id', getParkingLotById);
router.post('/parking-lots', createParkingLot);
router.put('/parking-lots/:id', updateParkingLot);
router.delete('/parking-lots/:id', deleteParkingLot);

module.exports = router; 