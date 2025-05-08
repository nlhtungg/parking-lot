const { pool } = require("../config/db");

exports.getAllParkingLots = async () => {
    const query = `
        SELECT 
            pl.*,
            u.username as manager_username
        FROM ParkingLots pl
        LEFT JOIN Users u ON pl.managed_by = u.user_id
        ORDER BY pl.lot_id
    `;
    const result = await pool.query(query);
    return result.rows;
};

exports.getParkingLotById = async (lotId) => {
    const query = `
        SELECT 
            pl.lot_id, pl.lot_name, pl.car_capacity, pl.bike_capacity,
            pl.current_car, pl.current_bike,
            u.username as manager_username
        FROM ParkingLots pl
        LEFT JOIN Users u ON pl.managed_by = u.user_id
        WHERE pl.lot_id = $1
    `;
    const result = await pool.query(query, [lotId]);
    return result.rows[0];
};

exports.getLotParkingSessions = async (lotId) => {
    const query = `
        SELECT * FROM ParkingSessions WHERE lot_id = $1 AND time_out IS NULL
    `;
    const result = await pool.query(query, [lotId]);
    return result.rows;
};

exports.createParkingLot = async (parkingLotData) => {
    const { lot_name, car_capacity, bike_capacity } = parkingLotData;

    const query = `
        INSERT INTO ParkingLots (
            lot_name,
            car_capacity,
            bike_capacity,
            current_car,
            current_bike
        ) VALUES ($1, $2, $3, 0, 0)
        RETURNING *
    `;

    const result = await pool.query(query, [lot_name, car_capacity, bike_capacity]);
    return result.rows[0];
};

exports.updateParkingLot = async (lotId, parkingLotData) => {
    const { lot_name, car_capacity, bike_capacity, managed_by } = parkingLotData;

    const query = `
        UPDATE ParkingLots
        SET 
            lot_name = $1,
            car_capacity = $2,
            bike_capacity = $3,
            managed_by = $4
        WHERE lot_id = $5
        RETURNING *
    `;

    const result = await pool.query(query, [lot_name, car_capacity, bike_capacity, managed_by, lotId]);
    return result.rows[0];
};

exports.deleteParkingLot = async (lotId) => {
    // First check if there are any active sessions
    const checkQuery = `
        SELECT COUNT(*) as active_sessions
        FROM ParkingSessions
        WHERE lot_id = $1 AND time_out IS NULL
    `;
    const checkResult = await pool.query(checkQuery, [lotId]);

    if (parseInt(checkResult.rows[0].active_sessions) > 0) {
        throw new Error("Cannot delete parking lot with active sessions");
    }

    const query = `
        DELETE FROM ParkingLots
        WHERE lot_id = $1
        RETURNING *
    `;
    const result = await pool.query(query, [lotId]);
    return result.rows[0];
};

// Add the new function here
exports.getParkingLotByManager = async (managerId) => {
    const query = `
        SELECT *
        FROM ParkingLots
        WHERE managed_by = $1
    `;
    const result = await pool.query(query, [managerId]);
    return result.rows[0];
};

// Fetch all lost ticket reports
exports.getAllLostTicketReports = async () => {
    const query = `
        SELECT ltr.*, ps.license_plate, ps.vehicle_type, ps.lot_id, ps.time_in, ps.time_out
        FROM LostTicketReport ltr
        JOIN ParkingSessions ps ON ltr.session_id = ps.session_id
        ORDER BY ltr.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};
