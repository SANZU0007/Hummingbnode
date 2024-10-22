import express from 'express';
import {
    checkIn,
    checkOut,
    getTodayCheckIns,
    getAllCheckIns,
    getCheckInByUser,
    getAllCheckInsByWeek,
    getAllCheckInsByDay,
    getAllCheckInsByMonth
} from '../controllers/attendanceController.js';

const router = express.Router();

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/today-checkins', getTodayCheckIns);
router.get('/all-checkins', getAllCheckIns);


router.get('/checkin/:employeeId', getCheckInByUser); // New route



router.get('/weekly', getAllCheckInsByWeek);



router.get('/day',getAllCheckInsByDay);
router.get('/month', getAllCheckInsByMonth);





export default router;
