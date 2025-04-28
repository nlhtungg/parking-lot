const subsRepo = require('../repositories/admin.monthlysubs.repo');
const paymentsRepo = require('../repositories/admin.payments.repo');
const {getToday} = require('../utils/date');

exports.getAllMonthlySubs = async (req, res) => {
    try {
        const monthlySubs = await subsRepo.getAllMonthlySubs();
        res.status(200).json({
            success: true,
            data: monthlySubs
        });
    } catch (error) {
        console.error('Get monthly subs error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

exports.createMonthlySub = async (req, res) => {
    try {
        const { 
            license_plate,
            vehicle_type,
            start_date,
            end_date,
            owner_name,
            owner_phone 
        } = req.body;

        // Validate required fields
        if (!license_plate || !vehicle_type || !start_date || !end_date || !owner_name || !owner_phone) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const today = getToday();
        const exist = await subsRepo.checkExistingSub(license_plate,today);
        if(exist > 0){
            res.status().json({
                success: false,
                message: 'There is an existing sub with this license plate'
            })
        }

        const newMonthlySub = await subsRepo.createMonthlySub({
            license_plate,
            vehicle_type,
            start_date,
            end_date,
            owner_name,
            owner_phone 
        });

        const subPayment = await paymentsRepo.createMonthlyPayment({
            //newMonthlySub.sub_id,
            payment_date : today,

        })

        res.status(201).json({
            success: true,
            data: {
                newMonthlySub,
                subPayment
            }
        });
    } catch (error) {
        console.error('Create monthly sub error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};