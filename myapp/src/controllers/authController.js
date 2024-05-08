const express = require("express");

const authService = require("../services/authService");

express.Router().post("/login", async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      message: "Login successful",
      token: result.token,
      userId: result.userId,
      userType: result.userType,
      id: result.id,
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

module.exports = router;
