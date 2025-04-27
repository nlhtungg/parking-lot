const { pool } = require('../config/db');

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