// backend/controllers/user/updateUser.js
const userModel = require("../../models/userModel");

async function updateUser(req, res) {
  try {
    // Extract userId from request body
    const { userId, email, name, role } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
        error: true
      });
    }

    // Build payload dynamically
    const payload = {
      ...(email && { email }),
      ...(name && { name }),
      ...(role && { role })
    };

    // Find user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true
      });
    }

    // Update user
    const updatedUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

    res.json({
      data: updatedUser,
      message: "User updated successfully",
      success: true,
      error: false
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      success: false,
      error: true
    });
  }
}

module.exports = updateUser;
