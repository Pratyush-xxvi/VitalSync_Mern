import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_SECRET } from '../middleware/auth.js';

// Signup controller
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send("Error: All fields are required!");
        }

        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).send("Error: Email is already in use!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            roles: ['ROLE_USER']
        });

        await user.save();

        return res.status(200).send("User registered successfully!");
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).send("Error: " + error.message);
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("Error: Email and password are required!");
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(401).send("Error: Invalid credentials!");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Error: Invalid credentials!");
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, roles: user.roles },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            token: token,
            id: user._id,
            name: user.name,
            email: user.email,
            roles: user.roles
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).send("Error: " + error.message);
    }
};
