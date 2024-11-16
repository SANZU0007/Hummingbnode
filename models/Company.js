// models/Company.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    industry: {
        type: String,
        required: true,
        trim: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{10,15}$/, 'Please fill a valid phone number'],
    },
    website: {
        type: String,
        trim: true,
    },
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
