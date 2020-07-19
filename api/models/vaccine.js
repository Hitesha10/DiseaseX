const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var vaccineSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  scientificName: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  forHuman: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Vaccine', vaccineSchema);
