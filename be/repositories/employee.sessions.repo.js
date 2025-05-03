const { pool } = require('../config/db');
const { getToday } = require('../utils/date');

exports.startSession = async (sessionData) => {
    const {
        lot_id,
        license_plate,
        vehicle_type,
        ticket_type,
        recorded_by
    } = sessionData;
    
    const query = `
        INSERT INTO ParkingSessions (
            lot_id,
            license_plate,
            vehicle_type,
            ticket_type,
            time_in,
            recorded_by
        ) VALUES ($1, $2, $3, $4, NOW(), $5)
        RETURNING *
    `;
    
    const result = await pool.query(query, [
        lot_id,
        license_plate,
        vehicle_type,
        ticket_type,
        recorded_by
    ]);
    
    return result.rows[0];
};

exports.getSession = async (sessionId) => {
    const query = `
        SELECT 
            ps.*,
            pl.lot_name,
            fc.service_fee,
            fc.penalty_fee
        FROM ParkingSessions ps
        JOIN ParkingLots pl ON ps.lot_id = pl.lot_id
        LEFT JOIN FeeConfigs fc ON ps.ticket_type = fc.ticket_type AND ps.vehicle_type = fc.vehicle_type
        WHERE ps.session_id = $1
    `;
    
    const result = await pool.query(query, [sessionId]);
    return result.rows[0];
};

exports.endSession = async (sessionId, payment_amount) => {
    const query = `
        UPDATE ParkingSessions
        SET 
            time_out = NOW(),
            payment_amount = $2,
            status = 'completed'
        WHERE session_id = $1
        RETURNING *
    `;
    
    const result = await pool.query(query, [sessionId, payment_amount]);
    return result.rows[0];
};

exports.getActiveSessionsByLot = async (lotId) => {
    const query = `
        SELECT * FROM ParkingSessions
        WHERE lot_id = $1 AND time_out IS NULL
        ORDER BY time_in DESC
    `;
    
    const result = await pool.query(query, [lotId]);
    return result.rows;
};

exports.checkMonthlySub = async (license_plate, current_date) => {
    const query = `
        SELECT * FROM MonthlySubs
        WHERE license_plate = $1
        AND start_date <= $2
        AND end_date >= $2
    `;
    
    const result = await pool.query(query, [license_plate, current_date]);
    return result.rows[0];
};

exports.incrementLotVehicleCount = async (lotId, vehicleType) => {
    const column = vehicleType === 'car' ? 'current_car' : 'current_bike';
    
    const query = `
        UPDATE ParkingLots
        SET ${column} = ${column} + 1
        WHERE lot_id = $1
        RETURNING *
    `;
    
    const result = await pool.query(query, [lotId]);
    return result.rows[0];
};

exports.decrementLotVehicleCount = async (lotId, vehicleType) => {
    const column = vehicleType === 'car' ? 'current_car' : 'current_bike';
    
    const query = `
        UPDATE ParkingLots
        SET ${column} = ${column} - 1
        WHERE lot_id = $1
        RETURNING *
    `;
    
    const result = await pool.query(query, [lotId]);
    return result.rows[0];
};