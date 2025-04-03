require("dotenv").config(); // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const voteRoutes = require("./Routes/voteroutes"); // Import the routes
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB using .env variable
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.use("/api", voteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
