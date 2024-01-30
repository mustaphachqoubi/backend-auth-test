const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
 Username: { type: String, unique: true, required: true },
 Email: { type: String, unique: true, required: true },
 Password: { type: String, required: true },
 Code: { type: Number, required: false, unique: false },
 });
module.exports = mongoose.model('User', userSchema);
