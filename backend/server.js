const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const voteRoutes = require("./routes/voteRoutes");

const app = express();

const cors = require("cors");

app.use(cors());

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vote", voteRoutes);

console.log("Starting server...");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:");
    console.log(err);
});

app.get("/", (req, res) => {
    res.send("Server Working");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});