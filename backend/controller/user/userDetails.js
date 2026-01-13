const userModel = require("../../models/userModel");
const jwt = require("jsonwebtoken");

async function userDetailsController(req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
        success: false,
        error: true,
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ SAME SECRET HERE
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    const user = await userModel
      .findById(decoded.userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      data: user,
      success: true,
      error: false,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      message: "Invalid or expired token",
      success: false,
      error: true,
    });
  }
}

module.exports = userDetailsController;
