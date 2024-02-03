const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  token: { type: String, required: true },
  deviceUUID: { type: String, required: true },
})

const userSchema = new mongoose.Schema({
 Username: { type: String, unique: true, required: true },
 Email: { type: String, unique: true, required: true },
 Password: { type: String, required: true },
 Code: { type: Number, required: false, unique: false },
Sessions: [ SessionSchema ]
 });
module.exports = mongoose.model('User', userSchema);
