// /controllers/userController.js

import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export const registerUser = async (req, res) => {
    const { name, email, password, role, team, image } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'The email address is already associated with another account. Please use a different email.', 
                type: 'error' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Configure the transporter for Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options with the plain-text password (not recommended for production)
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our Service!',
            text: `Hello ${name},\n\nThank you for registering! Here are your login details:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep your password safe.\n\nBest Regards,\nThe Team`
        };

        // Try to send the email
        const emailResponse = await transporter.sendMail(mailOptions);
        
        // If email response contains `rejected` addresses, do not proceed with registration
        if (emailResponse.rejected.length > 0) {
            return res.status(400).json({
                message: 'Invalid email address. Please provide a valid email address.',
                type: 'error'
            });
        }

        // Email sent successfully, proceed to register the user
        const newUser = new User({ name, email, password: hashedPassword, role, team, image });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully. A confirmation email has been sent.', type: 'success' });
        
    } catch (error) {
        console.error("Registration Error:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: `Invalid input: ${error.message}. Please make sure all required fields are filled correctly.`, 
                type: 'error' 
            });
        } else if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(400).json({ 
                message: 'Duplicate key error: A record with this data already exists in the database. Check your unique fields.', 
                type: 'error' 
            });
        } else {
            res.status(500).json({ 
                message: 'An unexpected error occurred on the server. Please try again later or contact support if the issue persists.', 
                type: 'error' 
            });
        }
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
                team: user.team,
                image:user.image
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', type: 'error' });
    }
};




// Update User (PUT function)
export const updateUser = async (req, res) => {
    const { id } = req.params; // Get user ID from URL parameters
    const { name, email, password, role, team, image } = req.body; // Destructure updated fields from request body

    try {
        // Find the user by ID
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found', type: 'error' });
        }

        // Check if email is being updated and already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'The email address is already associated with another account. Please use a different email.', 
                    type: 'error' 
                });
            }
        }

        // Hash new password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Update user fields
        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.team = team || user.team;
        user.image = image || user.image;

        await user.save();

        res.status(200).json({ 
            message: 'User updated successfully', 
            type: 'success',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                team: user.team,
                image: user.image
            }
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ 
            message: 'An unexpected error occurred on the server. Please try again later or contact support if the issue persists.', 
            type: 'error' 
        });
    }
};





// Get User Data by Team and Role
export const getUserByTeamAndRole = async (req, res) => {
    const { team } = req.params; // Get the team from URL parameters

    try {
        // Find users by team and role
        const users = await User.find({ team, role: "Employee" });

        if (!users || users.length === 0) {
            return res.status(404).json({ 
                message: 'No employees found in this team', 
                type: 'error' 
            });
        }

        // Return the user data
        res.status(200).json({ 
            message: 'Employees retrieved successfully', 
            type: 'success',
            users
        });
    } catch (error) {
        console.error("Error fetching employees by team and role:", error);
        res.status(500).json({ 
            message: 'An unexpected error occurred on the server. Please try again later or contact support if the issue persists.', 
            type: 'error' 
        });
    }
};
