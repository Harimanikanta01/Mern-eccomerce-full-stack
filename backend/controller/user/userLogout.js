// backend/controllers/user/userLogoutController.js

async function userLogout(req, res) {
  try {
    // No cookies to clear, frontend should remove JWT from localStorage

    res.json({
      message: "Logged out successfully",
      error: false,
      success: true,
      data: []
    });
  } catch (err) {
    res.status(500).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = userLogout;
