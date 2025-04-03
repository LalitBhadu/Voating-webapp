const mongoose = require("mongoose");

const leaderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

module.exports = mongoose.model("Leader", leaderSchema);
