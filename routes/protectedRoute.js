 const express = require('express');
 const router = express.Router();
 const verifyToken = require('../middleware/authMiddleware');
// Protected route
 router.get('/', verifyToken, (req, res) => {
   const userId = req.userId;
 res.status(200).json({ message: 'Protected route accessed', userId });
 });

module.exports = router;
