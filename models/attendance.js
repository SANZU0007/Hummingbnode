import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        default: null,
    },
    isCheckedIn: {
        type: Boolean,
        default: false,
    },
    userMood: {
        type: Number,
        default: null,
    },
    isCheckedOut: {
        type: Boolean,
        default: false,
    },
    earlyDispatch: { // Changed to camelCase
        type: Boolean,
        default: false,
    },
    lateArrival: {
        type: Boolean,
        default: false,
    },
    companyName: {
        type: String,
    },
      
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
