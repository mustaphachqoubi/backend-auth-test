const express = require("express");
const router = express.Router();
const User = require("../models/User");
const ForgetPassword = require("./ForgetPassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailjs = require("@emailjs/nodejs");
const { v4: uuidv4 } = require("uuid")

require("dotenv").config();

// User registration
router.post("/signup", async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;
    if (!Password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = new User({ Username, Email, Password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/signin", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(401).json({ error: "There is no such email" });
    }
    const passwordMatch = await bcrypt.compare(Password, user.Password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "wrong password" });
    }


    const deviceUUID = uuidv4()
    user.Devices.push(deviceUUID)

       await user.save();

    const updatedUser = await User.findOne({ Email });
    
    console.log(updatedUser)

    const token = jwt.sign(
      { id: user._id, email: user.Email },
      process.env.SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// User signOut
router.post("/signout", async (req, res) => {
  try{
    const { Email, deviceUUID } = req.body

const user = await User.findOneAndUpdate(
  { "Email": Email },
  { $pull: { "Devices": deviceUUID } },
  { new: true }
);

    res.status(200).json({ message: "successfull logout" })
  } catch (err) {
    res.status(500).json({ error: "logout failed" })
  }
})

// forget password email
router.post("/forgetpassword/email", async (req, res) => {
  try {
    const { Email } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(401).json({ error: "no user" });
    }

    const code = Math.floor(Math.random() * 9000 + 1000);

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { Code: code } },
      { new: true }
    );

    emailjs
      .send(
        "service_tw474m5",
        "template_a6sps07",
        {
          Username: updatedUser.Username,
          Code: updatedUser.Code,
          Email: updatedUser.Email,
        },
        {
          publicKey: "oqImZpAIUPtDbRdJS",
          privateKey: "IG7ti-qjHbRy2NXOewbDK",
        }
      )
      .then((response) => {})
      .catch((error) => {
        console.log(error.text);
      });

    const token = jwt.sign(
      { id: updatedUser._id, email: updatedUser.Email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user: updatedUser, token });
  } catch (err) {
    res.status(500).json({ error: "failed" });
  }
});

// forget password code
router.post("/forgetpassword/code", async (req, res) => {
  try {
    const { Email, Code } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(401).json({ error: "no user" });
    }

    if (user.Code !== Code) {
      return res.status(401).json({ error: "incorrect code" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.Email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "failed" });
  }
});

// forget password new pass
router.post("/forgetpassword/newpassword", async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(401).json({ error: "no user" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { Password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(500).json({ error: "failed to update password" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.Email },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "failed" });
  }
});

module.exports = router;
