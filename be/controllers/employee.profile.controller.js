const profileRepo = require('../repositories/employee.profile.repo');
const { hashPassword, verifyPassword } = require('../utils/pw');

exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.session.user.user_id; // Assuming you have user ID in req.user
        console.log('Fetching profile for user ID:', userId);
        const profile = await profileRepo.getMyProfile(userId);
        console.log('Profile fetched:', profile);
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateMyProfile = async (req, res) => {
    try {
        const userId = req.session.user.user_id; // Assuming you have user ID in req.user
        const { full_name, current_password, new_password } = req.body;

        let hashedPassword;
        if (new_password) {
            if (!current_password) {
                return res.status(400).json({ message: 'Current password is required to change password' });
            }
            // Fetch the current profile to verify the current password
            const profile = await profileRepo.getMyProfile(userId);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            const isPasswordValid = await verifyPassword(current_password, profile.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            hashedPassword = await hashPassword(new_password);
        }

        const updatedProfile = await profileRepo.updateMyProfile(userId, {
            full_name,
            password: hashedPassword || undefined, // Only update password if new one is provided and valid
        });

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}