const paymentsRepo = require("../repositories/admin.payments.repo");

exports.getAllPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await paymentsRepo.getAllPayments(page, limit);

        res.status(200).json({
            success: true,
            data: result.payments,
            pagination: result.pagination,
        });
    } catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
