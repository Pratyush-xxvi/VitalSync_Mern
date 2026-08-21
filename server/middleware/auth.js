const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'VitalSyncSuperSecretSigningKeyForJwtTokens2026Secure';

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'Unauthorized error: Full authentication is required to access this resource' });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized error: Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
};

// Admin role check middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.roles && req.user.roles.includes('ROLE_ADMIN')) {
        next();
    } else {
        return res.status(403).json({ message: 'Require Admin Role!' });
    }
};

module.exports = {
    verifyToken,
    isAdmin,
    JWT_SECRET
};
