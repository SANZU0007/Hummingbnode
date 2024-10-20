import express from 'express';
import User from '../models/user.js'; // Adjust the import path as necessary

const router = express.Router();

// GET /employees - Fetch only users with role "Employee"
router.get('/employees', async (req, res) => {
    try {
        const employees = await User.find({ role: 'Employee' })
            // .populate('scores')
            // .populate('tasks')
            // .populate('mood')
            // .populate('checkInOutHistory')
            // .exec();

        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ error: 'An error occurred while fetching employee details.' });
    }
});

export default router;
