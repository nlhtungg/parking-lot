const { pool } = require('../config/db');

exports.getAllMonthlySubs = async() => {
    return await pool.query(`SELECT * FROM MonthlySubs`);
}

exports.createMonthlySub = async (data) => {
    const {
        license_plate,
        vehicle_type,
        start_date,
        end_date,
        owner_name,
        owner_phone
    } = data;

    const query = `
        INSERT INTO MonthlySubs (
            license_plate,
            vehicle_type,
            start_date,
            end_date,
            owner_name,
            owner_phone
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    const result = await pool.query(query,[
        license_plate,
        vehicle_type,
        start_date,
        end_date,
        owner_name,
        owner_phone
    ]);
    return result.rows[0];
};

exports.checkExistingSub = async(license_plate, today) => {
    const query = `
        SELECT COUNT(*) FROM MonthlySubs
        WHERE license_plate = $1 AND (start_date < $2 AND end_date > $2)  
    `;
    const result = pool.query(query,[license_plate, today]);
    return result.rows[0].count;
}