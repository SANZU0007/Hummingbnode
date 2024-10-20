import CheckInOutTime from '../models/checkInOut.js';
import User from '../models/user.js';

export const setCheckInOut = async (req, res) => {
    try {
        const { user, checkIn, checkOut } = req.body;
        const userFetched = await User.findById(user);
        if (!userFetched) {
            return res.status(404).json({ message: "User not found", type: "error" });
        }

        // Handle check-in/check-out logic...
        
    } catch (error) {
        console.error('Error setting check-in/out data:', error);
        return res.status(500).json({ message: "Internal Server Error", type: "error", error: error.message });
    }
};

// Add other check-in/out related functions
