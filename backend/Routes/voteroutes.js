const express = require("express");
const router = express.Router();
const Leader = require("../Model/Votemodel");

// Static leader names (ensure they match exactly)
const LEADER_NAMES = ["chandan", "sandeep", "lalit", "manish"];

router.post("/vote", async (req, res) => {
    try {
        let { candidate } = req.body;

        const matchedLeader = LEADER_NAMES.find(
            (name) => name.toLowerCase() === candidate.toLowerCase()
        );

        if (!matchedLeader) {
            return res.status(400).json({ message: `Leader '${candidate}' not found` });
        }

        // Find the leader in the database (case-insensitive)
        let leader = await Leader.findOne({ name: new RegExp(`^${matchedLeader}$`, "i") });

        if (!leader) {
            // If the leader doesn't exist, create it with 1 vote
            leader = new Leader({ name: matchedLeader, votes: 1 });
        } else {
            // If found, increase the vote count
            leader.votes += 1;
        }

        // Save the updated leader to the database
        await leader.save();

        res.status(200).json({ message: `Vote cast successfully for ${matchedLeader}!`, leader });
    } catch (err) {
        res.status(500).json({ error: "Failed to vote", details: err.message });
    }
});
router.get("/leaders", async (req, res) => {
    try {
        const leaders = await Leader.find({}, { name: 1, votes: 1, _id: 0 }); // Fetch only name and votes
        res.status(200).json(leaders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch leaders", details: err.message });
    }
});

module.exports = router;
