const jwt = require("jsonwebtoken");

function authToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided",
                success: false
            });
        }

        const token = authHeader.split(" ")[1]; // Bearer TOKEN
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        req.userId = decoded.userId;
        next();

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
            success: false
        });
    }
}

module.exports = authToken;
