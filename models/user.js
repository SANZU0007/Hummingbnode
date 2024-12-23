// /models/user.js

import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Employee', 'HR' ,"TL" , 'Administrator'],
        required: true,
    },
    team: {
        type: String,
        enum: ['Development', 'Design', 'Management', 'Team'],
        required: true,
    },
   
    companyName: {
        type: String,
    },
});

// // Hash password before saving the user document
// userSchema.pre('save', async function (next) {
//     if (this.isModified('password')) {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//     }
//     next();
// });

const User = mongoose.model('User', userSchema);

export default User;
