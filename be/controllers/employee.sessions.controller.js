const sessionsRepo = require('../repositories/employee.sessions.repo');
const feeConfigRepo = require('../repositories/admin.feeConfig.repo');
const lotsRepo = require('../repositories/admin.lots.repo');
const { getToday, calculateHoursDifference } = require('../utils/date');

// Check-in a vehicle
exports.checkInVehicle = async (req, res) => {
    try {
        const { 
            lot_id, 
            license_plate, 
            vehicle_type, 
            ticket_type 
        } = req.body;
        
        // Validate required fields
        if (!lot_id || !license_plate || !vehicle_type || !ticket_type) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        
        // Get parking lot info and check capacity
        const parkingLot = await lotsRepo.getParkingLotById(lot_id);
        if (!parkingLot) {
            return res.status(404).json({
                success: false,
                message: 'Parking lot not found'
            });
        }
        
        // Check if lot is full for this vehicle type
        if (vehicle_type === 'car' && parkingLot.current_car >= parkingLot.car_capacity) {
            return res.status(400).json({
                success: false,
                message: 'Parking lot is full for cars'
            });
        }
        
        if (vehicle_type === 'bike' && parkingLot.current_bike >= parkingLot.bike_capacity) {
            return res.status(400).json({
                success: false,
                message: 'Parking lot is full for bikes'
            });
        }
        
        // Check if there's an active session for this license plate
        const activeSessions = await sessionsRepo.getActiveSessionsByLot(lot_id);
        const hasActiveSession = activeSessions.some(
            session => session.license_plate === license_plate
        );
        
        if (hasActiveSession) {
            return res.status(400).json({
                success: false,
                message: 'This vehicle already has an active session'
            });
        }
        
        // Create new session
        const newSession = await sessionsRepo.startSession({
            lot_id,
            license_plate,
            vehicle_type,
            ticket_type,
            recorded_by: req.session.user.user_id
        });
        
        // Increment vehicle count in the lot
        await sessionsRepo.incrementLotVehicleCount(lot_id, vehicle_type);
        
        res.status(201).json({
            success: true,
            message: 'Vehicle checked in successfully',
            data: newSession
        });
    } catch (error) {
        console.error('Check-in vehicle error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Check-out a vehicle
exports.checkOutVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get session information
        const session = await sessionsRepo.getSession(id);
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Parking session not found'
            });
        }
        
        // Check if session is already completed
        if (session.time_out) {
            return res.status(400).json({
                success: false,
                message: 'This parking session is already completed'
            });
        }
        
        // Calculate parking duration and fee
        const currentTime = new Date();
        const checkInTime = new Date(session.time_in);
        const hours = calculateHoursDifference(checkInTime, currentTime);
        
        let paymentAmount = 0;
        
        // Check if vehicle has a monthly subscription
        const today = getToday();
        const monthlyPass = await sessionsRepo.checkMonthlySub(session.license_plate, today);
        
        if (monthlyPass) {
            // No charge for monthly subscribers
            paymentAmount = 0;
        } else {
            // Get fee configuration
            const serviceFee = parseFloat(session.service_fee);
            
            // Calculate payment based on hours
            if (hours <= 1) {
                paymentAmount = serviceFee;
            } else {
                // First hour at standard rate, additional hours with incremental fee
                paymentAmount = serviceFee + ((hours - 1) * (serviceFee * 0.5));
            }
        }
        
        // End the session
        const updatedSession = await sessionsRepo.endSession(id, paymentAmount);
        
        // Decrement vehicle count in the lot
        await sessionsRepo.decrementLotVehicleCount(session.lot_id, session.vehicle_type);
        
        res.status(200).json({
            success: true,
            message: 'Vehicle checked out successfully',
            data: {
                ...updatedSession,
                hours_parked: hours.toFixed(2),
                monthly_pass: !!monthlyPass
            }
        });
    } catch (error) {
        console.error('Check-out vehicle error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all active sessions for employee's parking lot
exports.getActiveSessions = async (req, res) => {
    try {
        // Get the parking lot managed by this employee
        const userId = req.session.user.user_id;
        const parkingLot = await lotsRepo.getParkingLotByManager(userId);
        
        if (!parkingLot) {
            return res.status(404).json({
                success: false,
                message: 'You are not assigned to manage any parking lot'
            });
        }
        
        // Get active sessions for this lot
        const activeSessions = await sessionsRepo.getActiveSessionsByLot(parkingLot.lot_id);
        
        res.status(200).json({
            success: true,
            data: {
                lot_id: parkingLot.lot_id,
                lot_name: parkingLot.lot_name,
                sessions: activeSessions
            }
        });
    } catch (error) {
        console.error('Get active sessions error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};