const { pool } = require('../config/db');
const adminRepo = require('../repositories/admin.repo');

exports.getDashboard = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: {
                message: "Welcome to Admin Home",
                user: req.session.user
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Parking Lots Management
exports.getAllParkingLots = async (req, res) => {
    try {
        const parkingLots = await adminRepo.getAllParkingLots();
        res.status(200).json({
            success: true,
            data: parkingLots
        });
    } catch (error) {
        console.error('Get parking lots error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.getParkingLotById = async (req, res) => {
    try {
        const { id } = req.params;
        const parkingLot = await adminRepo.getParkingLotById(id);
        
        if (!parkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }

        res.status(200).json({
            success: true,
            data: parkingLot
        });
    } catch (error) {
        console.error('Get parking lot error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.createParkingLot = async (req, res) => {
    try {
        const { lot_name, car_capacity, bike_capacity } = req.body;

        // Validate required fields
        if (!lot_name || !car_capacity || !bike_capacity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const newParkingLot = await adminRepo.createParkingLot({
            lot_name,
            car_capacity,
            bike_capacity
        });

        res.status(201).json({
            success: true,
            data: newParkingLot
        });
    } catch (error) {
        console.error('Create parking lot error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.updateParkingLot = async (req, res) => {
    try {
        const { id } = req.params;
        const { lot_name, car_capacity, bike_capacity, managed_by } = req.body;

        // Validate required fields
        if (!lot_name || !car_capacity || !bike_capacity) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const updatedParkingLot = await adminRepo.updateParkingLot(id, {
            lot_name,
            car_capacity,
            bike_capacity,
            managed_by
        });

        if (!updatedParkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedParkingLot
        });
    } catch (error) {
        console.error('Update parking lot error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.deleteParkingLot = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedParkingLot = await adminRepo.deleteParkingLot(id);

        if (!deletedParkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Parking lot deleted successfully',
            data: deletedParkingLot
        });
    } catch (error) {
        console.error('Delete parking lot error:', error);
        if (error.message === 'Cannot delete parking lot with active sessions') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 