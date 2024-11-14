import Attendance from '../models/attendance.js';
import cron from 'node-cron';

// Helper function to get start and end of the day
const getStartAndEndOfDay = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

// Constants for office timings
const OFFICE_START_TIME = 9; // 9 AM
const OFFICE_END_TIME = 17; // 5 PM

// Handle check-in
export const checkIn = async (req, res) => {
    const { employeeId , companyName } = req.body;
    try {
        const { start, end } = getStartAndEndOfDay();

        // Check if the employee has already checked in today
        const existingCheckIn = await Attendance.findOne({
            employeeId,
            checkIn: { $gte: start, $lte: end }
        });

        if (existingCheckIn) {
            return res.status(400).send({ message: 'You have already checked in today.' });
        }

        const currentTime = new Date();

        // Determine if late arrival (after 9:00 AM)
        const lateArrival = currentTime.getHours() >= OFFICE_START_TIME && currentTime.getMinutes() > 0;

        // Record a new check-in
        const newCheckIn = new Attendance({
            employeeId,
            checkIn: currentTime,
            isCheckedIn: true,
            isCheckedOut: false,
            companyName ,
            lateArrival
        });

        await newCheckIn.save();
        res.status(201).send({ message: 'Check-in recorded successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error recording check-in', error });
    }
};

// Handle check-out
export const checkOut = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const { start, end } = getStartAndEndOfDay();

        // Find today's check-in record for the employee
        const attendance = await Attendance.findOne({
            employeeId,
            checkIn: { $gte: start, $lte: end }
        });

        if (!attendance) {
            return res.status(404).send({ message: 'No check-in record found for today!' });
        }

        // Check if check-out is already recorded
        if (attendance.isCheckedOut) {
            return res.status(400).send({ message: 'You have already checked out today.' });
        }

        const currentTime = new Date();

        // Determine if early dispatch (before 5:00 PM)
        const earlyDispatch = currentTime.getHours() < OFFICE_END_TIME;

        // Record the check-out time
        attendance.checkOut = currentTime;
        attendance.isCheckedOut = true;
        attendance.earlyDispatch = earlyDispatch;

        await attendance.save();
        res.status(200).send({ message: 'Check-out recorded successfully!' });
    } catch (error) {
        res.status(500).send({ message: 'Error recording check-out', error });
    }
};

// Get today's check-ins for all employees
export const getTodayCheckIns = async (req, res) => {

      const { companyName } = req.params;
    try {
        const { start, end } = getStartAndEndOfDay();

        const todayCheckIns = await Attendance.find({
            checkIn: { $gte: start, $lte: end },
            companyName: companyName
        });

        res.status(200).send(todayCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching today\'s check-ins', error });
    }
};

// Get all check-in records for all employees
export const getAllCheckIns = async (req, res) => {
    try {
        const allCheckIns = await Attendance.find();

        res.status(200).send(allCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching all check-in records', error });
    }
};

// Get check-in records for a specific user
export const getCheckInByUser = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const { start, end } = getStartAndEndOfDay();

        const userCheckIn = await Attendance.findOne({
            employeeId,
            checkIn: { $gte: start, $lte: end }
        });

        if (!userCheckIn) {
            return res.status(404).send({ message: 'No check-in record found for this user today. Please Check In ' });
        }

        res.status(200).send(userCheckIn);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching user check-in record', error });
    }
};


export const getAllCheckInsByWeek = async (req, res) => {
    try {
        const allCheckIns = await Attendance.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$checkIn" }, // Group by year
                        week: { $week: "$checkIn" } // Group by week number
                    },
                    records: { $push: "$$ROOT" } // Push all records into an array
                }
            },
            {
                $sort: { "_id.year": 1, "_id.week": 1 } // Sort by year and week number
            }
        ]);

        res.status(200).send(allCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching check-ins by week', error });
    }
};


export const getAllCheckInsByDay = async (req, res) => {
    try {
        const allCheckIns = await Attendance.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$checkIn" }, // Group by year
                        month: { $month: "$checkIn" }, // Group by month
                        day: { $dayOfMonth: "$checkIn" } // Group by day
                    },
                    records: { $push: "$$ROOT" } // Push all records into an array
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } // Sort by year, month, and day
            }
        ]);

        res.status(200).send(allCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching check-ins by day', error });
    }
};

export const getAllCheckInsByMonth = async (req, res) => {
    try {
        const allCheckIns = await Attendance.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$checkIn" }, // Group by year
                        month: { $month: "$checkIn" } // Group by month
                    },
                    records: { $push: "$$ROOT" } // Push all records into an array
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
        ]);

        res.status(200).send(allCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching check-ins by month', error });
    }
};





cron.schedule('0 0 * * *', async () => {
    try {
        await Attendance.updateMany(
            { isCheckedIn: true, isCheckedOut: true },
            { $set: { isCheckedIn: false, isCheckedOut: false } }
        );
        console.log('Attendance status reset successfully at midnight');
    } catch (error) {
        console.error('Error resetting attendance status:', error);
    }
});


// Update user mood
export const updateMood = async (req, res) => {
    const { employeeId, mood  } = req.body;

    try {
        const { start, end } = getStartAndEndOfDay();

        // Find today's check-in record for the employee
        const attendance = await Attendance.findOne({
            employeeId,
            checkIn: { $gte: start, $lte: end }
        });

        if (!attendance) {
            return res.status(404).send({ message: 'No check-in record found for today. Cannot update mood.' });
        }

        // Update the user mood
        attendance.userMood = mood;
        await attendance.save();

        res.status(200).send({ message: 'User mood updated successfully!', attendance });
    } catch (error) {
        res.status(500).send({ message: 'Error updating user mood', error });
    }
};




export const SingleUserAllCheckIns = async (req, res) => {
    const { employeeId } = req.params;
    try {
        const userCheckIns = await Attendance.find({
            employeeId
        });

        if (!userCheckIns || userCheckIns.length === 0) {
            return res.status(404).send({ message: 'No check-in records found for this user.' });
        }

        res.status(200).send(userCheckIns);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching user check-in records', error });
    }
};
