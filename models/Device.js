const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const deviceSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
