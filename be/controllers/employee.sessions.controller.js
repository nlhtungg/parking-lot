const sessionsRepo = require('../repositories/employee.sessions.repo');
const feeConfigRepo = require('../repositories/admin.feeConfig.repo');
const lotsRepo = require('../repositories/admin.lots.repo');
const { pool } = require('../config/db'); // Import the pool
const { getToday, calculateHoursDifference } = require('../utils/date');

// Vehicle Entry - Create a new parking session
exports.checkInVehicle = async (req, res) => {
    try {
        const { 
            lot_id, 
            license_plate, 
            vehicle_type
        } = req.body;
        
        // Validate required fields
        if (!lot_id || !license_plate || !vehicle_type) {
            return res.status(422).json({
                success: false,
                message: 'Missing required fields'
            });
        }
        
        // Validate license plate format (alphanumeric with optional hyphen)
        const licensePlateRegex = /^[A-Z0-9-]+$/i;
        if (!licensePlateRegex.test(license_plate)) {
            return res.status(422).json({
                success: false,
                message: 'Invalid license plate format'
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
        if (vehicle_type.toLowerCase() === 'car' && parkingLot.current_car >= parkingLot.car_capacity) {
            return res.status(400).json({
                success: false,
                message: 'Parking lot is full for cars'
            });
        }
        
        if (vehicle_type.toLowerCase() === 'bike' && parkingLot.current_bike >= parkingLot.bike_capacity) {
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
        
        // Check if vehicle has a monthly subscription
        const today = getToday();
        const monthlyPass = await sessionsRepo.checkMonthlySub(license_plate, today);
        const is_monthly = !!monthlyPass;
        
        // Create new session
        const newSession = await sessionsRepo.startSession({
            lot_id,
            license_plate,
            vehicle_type,
            is_monthly
        });
        
        // Generate ticket with QR/barcode data
        // In a real system, you might use a library to generate actual QR/barcode
        const ticket = {
            session_id: newSession.session_id,
            license_plate: newSession.license_plate,
            vehicle_type: newSession.vehicle_type,
            time_in: newSession.time_in,
            is_monthly: newSession.is_monthly,
            lot_id: newSession.lot_id,
            qr_code: `PK-${newSession.session_id}-${Date.now()}` // Simplified QR code data
        };
        
        res.status(201).json({
            success: true,
            message: 'Vehicle checked in successfully',
            ticket
        });
    } catch (error) {
        console.error('Check-in vehicle error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Vehicle Exit - Stage 1: Create a pending payment
exports.initiateCheckout = async (req, res) => {
    try {
        const { session_id } = req.body;
        
        if (!session_id) {
            return res.status(422).json({
                success: false,
                message: 'Session ID is required'
            });
        }
        
        // Get session information
        const session = await sessionsRepo.getSession(session_id);
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
        
        // Calculate parking duration and fee - using Math.ceil for rounding up
        const currentTime = new Date();
        const checkInTime = new Date(session.time_in);
        // Round up to the next hour for better UX and simpler calculations
        const hours = Math.ceil(calculateHoursDifference(checkInTime, currentTime));
        
        let totalAmount = 0;
        let sub_id = null;
        
        // Check if is_monthly is true from the session
        if (session.is_monthly) {
            // No charge for monthly subscribers
            totalAmount = 0;
            
            // Get the subscription ID
            const today = getToday();
            const monthlyPass = await sessionsRepo.checkMonthlySub(session.license_plate, today);
            if (monthlyPass) {
                sub_id = monthlyPass.sub_id;
            }
        } else {
            // Get fee configuration
            const serviceFee = parseFloat(session.service_fee);
            
            // Calculate payment based on hours
            if (hours <= 1) {
                totalAmount = serviceFee;
            } else {
                // First hour at standard rate, additional hours with incremental fee
                totalAmount = serviceFee + ((hours - 1) * (serviceFee * 0.5));
            }
            
            // Apply lost ticket penalty if applicable
            const is_lost = req.body.is_lost || false;
            if (is_lost && session.penalty_fee) {
                totalAmount += parseFloat(session.penalty_fee);
            }
        }
        
        // Create a pending payment
        const payment = await sessionsRepo.createPendingPayment({
            session_id,
            sub_id,
            total_amount: totalAmount
        });
        
        res.status(200).json({
            success: true,
            message: 'Checkout initiated',
            payment_id: payment.payment_id,
            amount: payment.total_amount,
            status: 'PENDING',
            session_details: {
                license_plate: session.license_plate,
                vehicle_type: session.vehicle_type,
                time_in: session.time_in,
                is_monthly: session.is_monthly,
                duration_hours: hours // Sending an integer now, not a float with decimal places
            }
        });
    } catch (error) {
        console.error('Initiate checkout error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Vehicle Exit - Stage 2: Confirm payment and complete checkout
exports.confirmCheckout = async (req, res) => {
    try {
        const { payment_id, payment_method, is_lost } = req.body;
        
        if (!payment_id || !payment_method) {
            return res.status(422).json({
                success: false,
                message: 'Payment ID and payment method are required'
            });
        }
        
        // Valid payment methods
        const validPaymentMethods = ['CASH', 'CARD'];
        if (!validPaymentMethods.includes(payment_method)) {
            return res.status(422).json({
                success: false,
                message: 'Invalid payment method'
            });
        }
        
        // Get the payment to find the session_id
        const query = `
            SELECT * FROM Payment
            WHERE payment_id = $1
        `;
        const result = await pool.query(query, [payment_id]);
        const payment = result.rows[0];
        
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        
        if (payment.payment_method !== 'PENDING') {
            return res.status(400).json({
                success: false,
                message: 'This payment has already been processed'
            });
        }
        
        // Confirm the payment and complete checkout
        const { payment: updatedPayment, session: updatedSession } = await sessionsRepo.confirmPayment({
            payment_id,
            payment_method,
            session_id: payment.session_id,
            is_lost: is_lost || false
        });
        
        res.status(200).json({
            success: true,
            message: 'Checkout completed successfully',
            payment: {
                payment_id: updatedPayment.payment_id,
                session_id: updatedPayment.session_id,
                amount: updatedPayment.total_amount,
                method: updatedPayment.payment_method,
                paid_at: updatedPayment.payment_date
            },
            session: {
                session_id: updatedSession.session_id,
                time_out: updatedSession.time_out
            }
        });
    } catch (error) {
        console.error('Confirm checkout error:', error);
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