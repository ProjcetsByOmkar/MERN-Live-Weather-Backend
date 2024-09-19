const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  city: String,
  unit: String,
  description: String,
  temp: Number,
}, { versionKey: false });

const weatherModel = mongoose.model('Weather', weatherSchema);

module.exports = weatherModel;
