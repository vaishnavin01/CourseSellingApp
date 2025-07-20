const jwt = require('jsonwebtoken');
const { JWT_ADMIN_SECRETE } = require('../config');

function adminMiddleware(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }

    try {
        const decodedData = jwt.verify(token, JWT_ADMIN_SECRETE);
        req.adminId = decodedData.userId; // make sure you used "userId" in jwt.sign()
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
}

module.exports = {
    adminMiddleware
};
