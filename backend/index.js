require("dotenv").config(); // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const voteRoutes = require("./Routes/voteroutes"); // Import the routes
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// const Leader = require("./Model/Votemodel"); // Import the Leader model

app.use("/api", voteRoutes);
// const LEADER_NAMES = ["Chandan", "Politician 1", "Politician 2"];

// const createLeaders = async () => {
//     try {
//         for (const name of LEADER_NAMES) {
//             const existingLeader = await Leader.findOne({ name });

//             if (!existingLeader) {
//                 await Leader.create({ name, votes: 0 });
//                 console.log(`✅ Leader '${name}' added to database.`);
//             } else {
//                 console.log(`🔄 Leader '${name}' already exists.`);
//             }
//         }
//         console.log("✅ All leaders are initialized.");
//     } catch (error) {
//         console.error("❌ Error creating leaders:", error);
//     }
// };

// Connect to MongoDB using .env variable
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    // createLeaders()
    .catch(err => console.log(err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
