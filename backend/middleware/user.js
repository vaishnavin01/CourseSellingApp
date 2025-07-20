const jwt = require('jsonwebtoken');
const { JWT_USER_SECRETE } = require('../config');

function userMiddleware(req, res, next) {
    const token = req.headers.token; // Token should be passed in "token" header

    if (!token) {
        return res.status(403).json({ message: "Token not provided" });
    }

    try {
        const decodedData = jwt.verify(token, JWT_USER_SECRETE);
        req.userId = decodedData.userId; // Should match the field used in jwt.sign()
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token", error: error.message });
    }
}

module.exports = {
    userMiddleware
};
