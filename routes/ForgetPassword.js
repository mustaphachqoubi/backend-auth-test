const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

require("dotenv").config();

// confirm email
router.post("/email", async (req, res) => {
  console.log("Forget Password Module Loaded");
  try {
    const { Email } = req.body;
    console.log("Email:", Email);
    const user = await User.findOne({ Email });
console.log("User:", user);
    if (!user) {
console.log("No user found");
      return res.status(401).json({ error: "no user" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.Email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "failed" });
  }
});

// security code
router.post("/code", async (req, res) => {
  console.log("code");
});

// new password
router.post("/newpassword", async (req, res) => {
  console.log("new password");
});

module.exports = router;
