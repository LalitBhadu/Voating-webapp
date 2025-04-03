const mongoose = require("mongoose");

const leaderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    votes: { type: Number, default: 0 },
    votedUsers: { type: [String], default: [] } // Stores voter IP addresses
});

module.exports = mongoose.model("Leader", leaderSchema);
