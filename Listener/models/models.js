const mongoose = require("mongoose");
const dataSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    data: [],
    particularData: {
      name: String,
      origin: String,
      destination: String,
    },
  
    count: { type: Number, default: 0, required: false },
  });
  
  const DataModel = mongoose.model("listenerdatas", dataSchema);

  module.exports = {DataModel}