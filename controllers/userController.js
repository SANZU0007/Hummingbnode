// /controllers/userController.js

import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register User (existing function)
export const registerUser = async (req, res) => {
    const { name, email, password, role, team } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use', type: 'error' });
        }

        const newUser = new User({ name, email, password, role, team });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', type: 'success' });
    } catch (error) {

        console.log(error)
        res.status(500).json({ message: 'Internal server error', type: 'error' });
    }
};

// Login User (new function)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password', type: 'error' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password', type: 'error' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, email: user.email }, '12345678989898', { expiresIn: '1h' });

        res.json({ 
            message: 'Logged in successfully',
            type: 'success',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                team: user.team
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', type: 'error' });
    }
};
