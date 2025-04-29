const {pool} = require('../config/db')

exports.getServiceFee = async (ticket_type, vehicle_type) => {
    const query = `SELECT * FROM FeeConfigs WHERE ticket_type = $1 AND vehicle_type = $2`;
    const result = await pool.query(query, [ticket_type, vehicle_type]);
    return result.rows[0];
}

exports.getPenaltyFee = async (ticket_type, vehicle_type) => {
    const query = `SELECT penalty_fee FROM FeeConfigs WHERE ticket_type = $1 AND vehicle_type = $2`;
    const result = await pool.query(query, [ticket_type, vehicle_type]);
    return result.rows[0].penalty_fee;
}

exports.createServiceFee = async (ticket_type, vehicle_type, service_fee) => {
    const query = `
        INSERT INTO FeeConfigs (ticket_type, vehicle_type, service_fee)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await pool.query(query, [ticket_type, vehicle_type, service_fee]);
    return result.rows[0];
}

exports.setServiceFee = async (ticket_type, vehicle_type, service_fee) => {
    const query = `
        UPDATE FeeConfigs
        SET service_fee = $1
        WHERE ticket_type = $2 AND vehicle_type = $3
        RETURNING *
    `;
    const result = await pool.query(query, [service_fee, ticket_type, vehicle_type]);
    return result.rows[0];
}