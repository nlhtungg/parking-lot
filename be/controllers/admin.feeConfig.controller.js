const feeRepo = require('../repositories/admin.feeConfig.repo');

const setServiceFee = async (req, res) => {
    try {
        const { ticket_type, vehicle_type, service_fee } = req.body;
        //console.log('Request body:', req.body);

        // Validate required fields
        if (!ticket_type || !vehicle_type || !service_fee) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const checkExistingFee = await feeRepo.getServiceFee(ticket_type, vehicle_type);
        let result;
        if (checkExistingFee) {
            result = await feeRepo.setServiceFee(ticket_type, vehicle_type, service_fee);   
        } else {
            result = await feeRepo.createServiceFee(ticket_type, vehicle_type, service_fee);
        }
        //console.log('Set service fee result:', result);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Set service fee error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

module.exports = {
    setServiceFee
};