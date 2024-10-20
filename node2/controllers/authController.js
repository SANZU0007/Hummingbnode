import User from '../models/user.js';
import passport from 'passport';

export const register = async (req, res) => {
    try {
        const { name, username, scores, email, password, role, team } = req.body;
        const user = new User({ name, username, scores, email, role, team });
        const registeredUser = await User.register(user, password);
        console.log("User registered: ", registeredUser);
        return res.json({ data: registeredUser, message: "Registration Successful", type: "success" });
    } catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ data: null, message: err.message, type: 'error' });
    }
};

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: 'Invalid username or password', type: 'error' });
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.json({ data: user, message: 'Logged in successfully', type: 'success' });
        });
    })(req, res, next);
};

export const logout = async (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to log out', type: 'error' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to destroy session', type: 'error' });
            }
            res.clearCookie('session');
            return res.json({ message: 'Logged out successfully', type: 'success' });
        });
    });
};
