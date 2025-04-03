const express = require("express");
const router = express.Router();
const Leader = require("../Model/Votemodel"); // Import the Leader model

router.get("/leaders", async (req, res) => {
    try {
        const leaders = await Leader.find();
        res.json(leaders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Cast a vote
router.post("/vote", async (req, res) => {
    try {
        const { leaderId, voterId } = req.body;

        if (!voterId) {
            return res.status(400).json({ message: "Invalid voter ID" });
        }

        // Check if the voter already voted (stored in MongoDB or localStorage in frontend)
        const existingVote = await Leader.findOne({ [`votes.${voterId}`]: { $exists: true } });

        if (existingVote) {
            return res.status(400).json({ message: "You have already voted!" });
        }

        // Increase vote count
        const leader = await Leader.findByIdAndUpdate(
            leaderId,
            { $inc: { votes: 1 } }, // Increment vote count
            { new: true }
        );

        if (!leader) {
            return res.status(404).json({ message: "Leader not found" });
        }

        res.json({ message: "Vote cast successfully!", leader });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
